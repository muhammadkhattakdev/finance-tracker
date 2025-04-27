class NotificationService {
  constructor() {
    this.NOTIFICATION_EVENT = "app:notification";
  }

  /**
   * @param {Object} notification
   * @param {string} notification.title
   * @param {string} notification.message -
   * @param {string} notification.type
   */
  showToast(notification) {
    const event = new CustomEvent(this.NOTIFICATION_EVENT, {
      detail: notification,
    });

    document.dispatchEvent(event);
  }

  /**
   * @param {Function} callback
   * @returns {Function}
   */
  onNotification(callback) {
    const handler = (event) => {
      callback(event.detail);
    };

    document.addEventListener(this.NOTIFICATION_EVENT, handler);

    return () => {
      document.removeEventListener(this.NOTIFICATION_EVENT, handler);
    };
  }
}

const notificationService = new NotificationService();

export default notificationService;
