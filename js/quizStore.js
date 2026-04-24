const quizStore = Vue.reactive({
  responses: [],
  finalScore: null,
  settings: {
    questionCount: 10,
    showImages: true,
    instantFeedback: true,
  },
  quizStarted: false,
  quizCompleted: false,
  error: null,

  setSettings(s) {
    this.settings.questionCount = s.questionCount || 10;
    this.settings.showImages = s.showImages !== false;
    this.settings.instantFeedback = s.instantFeedback !== false;
    this.saveSettings();
  },

  addResponse(response) {
    this.responses.push(response);
  },

  setFinalScore(score) {
    this.finalScore = score;
    this.quizCompleted = true;
    this.appendHistory(score);
  },

  startQuiz() {
    this.responses = [];
    this.finalScore = null;
    this.quizStarted = true;
    this.quizCompleted = false;
    this.error = null;
  },

  reset() {
    this.responses = [];
    this.finalScore = null;
    this.quizStarted = false;
    this.quizCompleted = false;
    this.error = null;
  },

  setError(msg) {
    this.error = msg;
  },

  saveSettings() {
    try {
      localStorage.setItem('neatiq_settings', JSON.stringify(this.settings));
    } catch (e) { /* storage full */ }
  },

  loadSettings() {
    try {
      const raw = localStorage.getItem('neatiq_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.settings.questionCount = parsed.questionCount || 10;
        this.settings.showImages = parsed.showImages !== false;
        this.settings.instantFeedback = parsed.instantFeedback !== false;
      }
    } catch (e) { /* issue in storage, use defaults */ }
  },

  appendHistory(entry) {
    try {
      let history = JSON.parse(localStorage.getItem('neatiq_history') || '[]');
      history.push(entry);
      if (history.length > 20) history = history.slice(-20);
      localStorage.setItem('neatiq_history', JSON.stringify(history));
    } catch (e) { /* storage full */ }
  },

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem('neatiq_history') || '[]');
    } catch (e) {
      return [];
    }
  },

  clearHistory() {
    try { localStorage.removeItem('neatiq_history'); } catch (e) { /* ignore */ }
  },
});
