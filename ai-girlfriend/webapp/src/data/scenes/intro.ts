import type { Scene } from '@/types';
import { createScene, createSceneMessage } from '@/lib/game/scenes';
import { createSkillCheck } from '@/lib/game/skillCheck';

/**
 * Вводная сцена для Алисы
 */
export const alisaIntroScene: Scene = createScene(
  'alisa-intro',
  'alisa',
  'Первая встреча',
  [
    createSceneMessage(
      'intro-1',
      'Ты заходишь в уютную кофейню. За столиком у окна сидит девушка с книгой.',
      'narrator',
      { delay: 500 }
    ),
    createSceneMessage(
      'intro-2',
      'Привет! Ты тоже любишь это место? Здесь такая приятная атмосфера для чтения... ☕',
      'bot'
    ),
    createSceneMessage(
      'intro-3',
      'Она улыбается и показывает обложку книги — это Достоевский.',
      'narrator'
    ),
    createSceneMessage(
      'intro-4',
      'Знаешь, я верю, что случайных встреч не бывает. Может, присядешь?',
      'bot',
      {
        choices: [
          {
            id: 'sit-confident',
            text: '«Конечно, буду рад составить компанию»',
            effects: { affection: 5, chemistry: 3 },
          },
          {
            id: 'sit-shy',
            text: '«Э-э... да, наверное»',
            effects: { trust: 2 },
          },
          {
            id: 'compliment',
            text: '«С удовольствием. У тебя отличный вкус в литературе»',
            effects: { affection: 8, chemistry: 5 },
            requiredStats: { chemistry: 15 },
          },
        ],
      }
    ),
    createSceneMessage(
      'intro-5',
      'Она мягко улыбается и откладывает книгу.',
      'narrator'
    ),
    createSceneMessage(
      'intro-6',
      'Меня зовут Алиса. А тебя? 😊',
      'bot'
    ),
  ]
);

/**
 * Сцена skill-check для Марии
 */
export const mariaAdventureScene: Scene = createScene(
  'maria-adventure',
  'maria',
  'Внезапное предложение',
  [
    createSceneMessage(
      'adv-1',
      'Мария внезапно хватает тебя за руку.',
      'narrator'
    ),
    createSceneMessage(
      'adv-2',
      'Эй! Я тут узнала про одно секретное место в городе. Пойдём со мной? Это будет весело! 🎉',
      'bot'
    ),
    {
      id: 'adv-3',
      text: 'Она смотрит на тебя с азартом. Это может быть что угодно...',
      sender: 'narrator',
      skillCheck: createSkillCheck(
        'maria-trust-check',
        'trust',
        'medium',
        'Довериться авантюре Марии',
        'Ты решаешь рискнуть — и не жалеешь! Мария приводит тебя на крышу с потрясающим видом на закат.',
        'Ты колеблешься слишком долго, и Мария разочарованно вздыхает. «Ладно, в другой раз...»',
        {
          success: { trust: 10, chemistry: 5, affection: 5 },
          failure: { trust: -5, affection: -3 },
        }
      ),
    },
  ],
  { requiredStats: { trust: 25 } }
);

// Экспорт всех сцен
export const scenes: Scene[] = [
  alisaIntroScene,
  mariaAdventureScene,
];

export function getSceneById(id: string): Scene | undefined {
  return scenes.find((scene) => scene.id === id);
}

export function getScenesByCharacter(characterId: string): Scene[] {
  return scenes.filter((scene) => scene.characterId === characterId);
}

