/**
 * DialogueEngine — движок обработки диалогов
 * Управляет потоком сообщений, выборами и переходами
 */

import type { ChatMessage, DialogChoice } from '@/types';

export interface DialogueNode {
  id: string;
  text: string;
  speaker: 'bot' | 'narrator' | 'user';
  choices?: DialogChoice[];
  nextNodeId?: string;
  condition?: () => boolean;
}

export interface DialogueState {
  currentNodeId: string | null;
  history: string[];
  isComplete: boolean;
}

/**
 * Создаёт начальное состояние диалога
 */
export function createDialogueState(startNodeId: string): DialogueState {
  return {
    currentNodeId: startNodeId,
    history: [],
    isComplete: false,
  };
}

/**
 * Получает следующий узел диалога
 */
export function getNextNode(
  nodes: DialogueNode[],
  currentNodeId: string,
  choiceId?: string
): DialogueNode | null {
  const currentNode = nodes.find((n) => n.id === currentNodeId);
  if (!currentNode) return null;

  // Если есть выбор, ищем соответствующий переход
  if (choiceId && currentNode.choices) {
    const choice = currentNode.choices.find((c) => c.id === choiceId);
    if (choice) {
      // TODO: применить эффекты выбора
    }
  }

  // Переход к следующему узлу
  const nextId = currentNode.nextNodeId;
  if (!nextId) return null;

  return nodes.find((n) => n.id === nextId) ?? null;
}

/**
 * Преобразует DialogueNode в ChatMessage
 */
export function nodeToMessage(node: DialogueNode): ChatMessage {
  return {
    id: `msg-${node.id}-${Date.now()}`,
    from: node.speaker === 'user' ? 'user' : 'bot',
    text: node.text,
    type: node.choices ? 'choice' : 'text',
    timestamp: Date.now(),
    choices: node.choices,
  };
}

export default {
  createDialogueState,
  getNextNode,
  nodeToMessage,
};

