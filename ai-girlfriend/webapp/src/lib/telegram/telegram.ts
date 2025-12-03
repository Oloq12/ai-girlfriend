/**
 * Утилиты для работы с Telegram WebApp API
 */

/** Проверка, запущено ли приложение в Telegram */
export function isTelegramWebApp(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

/** Получение объекта WebApp */
export function getWebApp() {
  if (!isTelegramWebApp()) {
    return null;
  }
  return window.Telegram.WebApp;
}

/** Инициализация Telegram WebApp */
export function initTelegramWebApp(): void {
  const webApp = getWebApp();
  if (!webApp) return;

  // Разворачиваем на весь экран
  webApp.expand();
  
  // Сигнализируем о готовности
  webApp.ready();
  
  // Включаем кнопку закрытия
  webApp.enableClosingConfirmation();
}

/** Получение данных пользователя Telegram */
export function getTelegramUser() {
  const webApp = getWebApp();
  return webApp?.initDataUnsafe?.user ?? null;
}

/** Получение ID пользователя Telegram */
export function getTelegramUserId(): number | null {
  return getTelegramUser()?.id ?? null;
}

/** Показать главную кнопку */
export function showMainButton(text: string, onClick: () => void): void {
  const webApp = getWebApp();
  if (!webApp) return;

  webApp.MainButton.text = text;
  webApp.MainButton.onClick(onClick);
  webApp.MainButton.show();
}

/** Скрыть главную кнопку */
export function hideMainButton(): void {
  const webApp = getWebApp();
  if (!webApp) return;

  webApp.MainButton.hide();
}

/** Показать Back Button */
export function showBackButton(onClick: () => void): void {
  const webApp = getWebApp();
  if (!webApp) return;

  webApp.BackButton.onClick(onClick);
  webApp.BackButton.show();
}

/** Скрыть Back Button */
export function hideBackButton(): void {
  const webApp = getWebApp();
  if (!webApp) return;

  webApp.BackButton.hide();
}

/** Вызвать haptic feedback */
export function hapticFeedback(
  type: 'impact' | 'notification' | 'selection',
  style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error'
): void {
  const webApp = getWebApp();
  if (!webApp?.HapticFeedback) return;

  switch (type) {
    case 'impact':
      webApp.HapticFeedback.impactOccurred(style as 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' || 'medium');
      break;
    case 'notification':
      webApp.HapticFeedback.notificationOccurred(style as 'success' | 'warning' | 'error' || 'success');
      break;
    case 'selection':
      webApp.HapticFeedback.selectionChanged();
      break;
  }
}

/** Цвета темы Telegram */
export function getThemeColors() {
  const webApp = getWebApp();
  return {
    bgColor: webApp?.themeParams?.bg_color ?? '#ffffff',
    textColor: webApp?.themeParams?.text_color ?? '#000000',
    hintColor: webApp?.themeParams?.hint_color ?? '#999999',
    linkColor: webApp?.themeParams?.link_color ?? '#2481cc',
    buttonColor: webApp?.themeParams?.button_color ?? '#2481cc',
    buttonTextColor: webApp?.themeParams?.button_text_color ?? '#ffffff',
    secondaryBgColor: webApp?.themeParams?.secondary_bg_color ?? '#f0f0f0',
  };
}

