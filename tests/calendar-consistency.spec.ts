import { test, expect } from '@playwright/test';
import { readRepoFile } from './test-helpers';

interface CalendarLesson {
  number: number;
  date: string;
  title: string;
  ponderada?: boolean;
}

interface CalendarModule {
  id: string;
  course: string;
  name: string;
  config: string;
  home: string;
  lessons: CalendarLesson[];
}

interface Calendar {
  trimester: {
    code: string;
    start: string;
    end: string;
    professor: string;
  };
  active_modules: CalendarModule[];
}

const calendar: Calendar = JSON.parse(readRepoFile('config/calendar.json'));

const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

/** Número de cada card de aula da home e se ele traz a flag de ponderada. */
function extractPonderadaFlags(html: string): Map<number, boolean> {
  const flags = new Map<number, boolean>();
  const cards = html.split(/class="[^"]*\blesson-card\b[^"]*"/).slice(1);
  for (const card of cards) {
    const num = card.match(/class="lesson-number"[^>]*>\s*(\d+)\s*</);
    if (num) flags.set(Number(num[1]), /class="ponderada-badge"/.test(card));
  }
  return flags;
}

function extractDatesFromHome(html: string): string[] {
  return [...html.matchAll(/<small>\s*📅\s*(\d{2}\/\d{2}\/\d{4})\s*<\/small>/g)].map((m) => m[1]);
}

test.describe('config/calendar.json - Consistência com cards das homes', () => {
  test('o trimestre tem código, datas e professor preenchidos', () => {
    // Aceita a nomenclatura do Inteli (`2026-2A`, ano + semestre + bloco) e o
    // formato antigo por trimestre (`2026-T2`), ainda presente em registros anteriores.
    expect(calendar.trimester.code).toMatch(/^\d{4}-(T[1-4]|[1-2][AB])$/);
    expect(calendar.trimester.start).toMatch(dateRegex);
    expect(calendar.trimester.end).toMatch(dateRegex);
    expect(calendar.trimester.professor.length).toBeGreaterThan(0);
  });

  test('existe pelo menos um módulo ativo no trimestre', () => {
    expect(calendar.active_modules.length).toBeGreaterThan(0);
  });

  for (const mod of calendar.active_modules) {
    test.describe(`Módulo ativo: ${mod.id}`, () => {
      test('todas as datas das aulas estão no formato dd/mm/yyyy', () => {
        for (const lesson of mod.lessons) {
          expect(lesson.date, `aula ${lesson.number} de ${mod.id}`).toMatch(dateRegex);
        }
      });

      test('os números das aulas são únicos e consecutivos a partir de 1', () => {
        const numbers = mod.lessons.map((l) => l.number);
        const expected = Array.from({ length: numbers.length }, (_, i) => i + 1);
        expect(numbers).toEqual(expected);
      });

      test(`as datas dos cards em ${mod.home} batem com o calendar.json`, () => {
        const html = readRepoFile(mod.home);
        const homeDates = extractDatesFromHome(html);
        const calendarDates = mod.lessons.map((l) => l.date);

        expect(
          homeDates.length,
          `Quantidade de datas em ${mod.home} (${homeDates.length}) deve bater com calendar.json (${calendarDates.length})`,
        ).toBe(calendarDates.length);

        for (let i = 0; i < calendarDates.length; i++) {
          expect(
            homeDates[i],
            `Aula ${mod.lessons[i].number} de ${mod.id}: card mostra "${homeDates[i]}" mas calendar.json diz "${calendarDates[i]}"`,
          ).toBe(calendarDates[i]);
        }
      });

      test(`toda aula com "ponderada": true tem a flag de ponderada em ${mod.home}, e só ela`, () => {
        const flags = extractPonderadaFlags(readRepoFile(mod.home));
        for (const lesson of mod.lessons) {
          const temFlag = flags.get(lesson.number) ?? false;
          expect(
            temFlag,
            lesson.ponderada
              ? `Aula ${lesson.number} de ${mod.id} tem ponderada no calendar.json, mas o card não traz <span class="ponderada-badge">`
              : `Aula ${lesson.number} de ${mod.id} traz a flag de ponderada no card, mas não tem "ponderada": true no calendar.json`,
          ).toBe(Boolean(lesson.ponderada));
        }
      });

      test(`a home ${mod.home} não tem cards sem data (📅) — qualquer aula sem data quebra o calendário`, () => {
        const html = readRepoFile(mod.home);
        const cardCount = (html.match(/class="lesson-number/g) || []).length;
        const dateCount = extractDatesFromHome(html).length;
        expect(
          dateCount,
          `${mod.home} tem ${cardCount} cards de aula mas só ${dateCount} têm data 📅`,
        ).toBe(cardCount);
      });
    });
  }
});
