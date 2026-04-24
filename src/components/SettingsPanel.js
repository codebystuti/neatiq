const SettingsPanel = {
  name: 'SettingsPanel',

  props: {
    visible: { type: Boolean, default: false },
  },

  emits: ['close', 'start'],

  inject: ['store'],

  data() {
    return {
      questionCount: 10,
      showImages: true,
      instantFeedback: true,
    };
  },

  created() {
    // load last-used settings from store
    this.questionCount = this.store.settings.questionCount;
    this.showImages = this.store.settings.showImages;
    this.instantFeedback = this.store.settings.instantFeedback;
  },

  methods: {
    startQuiz() {
      this.$emit('start', {
        questionCount: this.questionCount,
        showImages: this.showImages,
        instantFeedback: this.instantFeedback,
      });
    },
  },

  template: `
    <transition name="modal">
      <div v-if="visible" class="settings-overlay" @click.self="$emit('close')">
        <div class="settings-panel" role="dialog" aria-label="Quiz settings">

          <div class="settings-panel__header">
            <h3 class="settings-panel__title">Quiz Settings</h3>
            <button class="settings-panel__close" @click="$emit('close')" aria-label="Close settings">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="settings-panel__body">

            <div class="settings-panel__group">
              <label class="settings-panel__label">Number of Questions</label>
              <p class="settings-panel__hint">Choose how many questions you want to attempt</p>
              <div class="settings-panel__pills">
                <button
                  v-for="n in [5, 10]"
                  :key="n"
                  class="settings-panel__pill"
                  :class="{ 'settings-panel__pill--active': questionCount === n }"
                  @click="questionCount = n"
                >{{ n }} questions</button>
              </div>
            </div>

            <div class="settings-panel__group">
              <label class="settings-panel__label">Show Images</label>
              <p class="settings-panel__hint">Display images alongside questions that have them</p>
              <div class="settings-panel__toggle-row">
                <button
                  class="settings-panel__toggle"
                  :class="{ 'settings-panel__toggle--on': showImages }"
                  @click="showImages = !showImages"
                  role="switch"
                  :aria-checked="String(showImages)"
                >
                  <span class="settings-panel__toggle-knob"></span>
                </button>
                <span class="settings-panel__toggle-label">{{ showImages ? 'On' : 'Off' }}</span>
              </div>
            </div>

            <div class="settings-panel__group">
              <label class="settings-panel__label">Instant Feedback</label>
              <p class="settings-panel__hint">Show correct/incorrect immediately, or reveal all at the end</p>
              <div class="settings-panel__toggle-row">
                <button
                  class="settings-panel__toggle"
                  :class="{ 'settings-panel__toggle--on': instantFeedback }"
                  @click="instantFeedback = !instantFeedback"
                  role="switch"
                  :aria-checked="String(instantFeedback)"
                >
                  <span class="settings-panel__toggle-knob"></span>
                </button>
                <span class="settings-panel__toggle-label">{{ instantFeedback ? 'After each question' : 'All at the end' }}</span>
              </div>
            </div>

          </div>

          <div class="settings-panel__footer">
            <button class="btn btn--primary" @click="startQuiz">
              Start Quiz
            </button>
          </div>

        </div>
      </div>
    </transition>
  `,
};
