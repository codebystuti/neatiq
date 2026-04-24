const PollQuestion = {
  name: 'PollQuestion',

  props: {
    poll: { type: Object, required: true },
    showImages: { type: Boolean, default: true },
  },

  emits: ['completed'],

  data() {
    return {
      pollAnswered: false,
      selectedIndex: null,
      showFeedback: false,
      isProcessingNext: false,
    };
  },

  methods: {
    getLabel(index) {
      return String.fromCharCode(65 + index);
    },

    selectAnswer(event, index) {
      if (this.pollAnswered) return;
      this.pollAnswered = true;
      this.selectedIndex = index;
      setTimeout(() => { this.showFeedback = true; }, 1000);
    },

    handleKeyDown(event, index) {
      if (this.pollAnswered) return;
      const len = this.poll.options.length;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        const next = (index + 1) % len;
        this.$el.querySelector('#poll-option-' + next)?.focus();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const prev = (index - 1 + len) % len;
        this.$el.querySelector('#poll-option-' + prev)?.focus();
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.selectAnswer(event, index);
      }
    },

    finish() {
      if (this.isProcessingNext) return;
      this.isProcessingNext = true;

      this.showFeedback = false;

      setTimeout(() => {
        this.$emit('completed', {
          questionType: 'poll',
          pollTitle: this.poll.title,
          pollQuestion: this.poll.question,
          userAnswer: this.poll.options[this.selectedIndex]?.option || '',
          answeredAt: new Date().toISOString(),
        });
      }, 900);
    },
  },

  template: `
    <section class="poll">
      <div class="poll__inner container">
        <div class="poll__content">
          <h2 class="poll__title">{{ poll.title }}</h2>
          <p class="poll__question">{{ poll.question }}</p>
          <p v-if="poll.intro_text" class="poll__intro">{{ poll.intro_text }}</p>
          <div class="poll__options">
            <div
              v-for="(option, index) in poll.options"
              :key="index"
              class="mcq__option"
              :class="{ 'mcq__option--selected': selectedIndex === index }"
            >
              <input
                type="radio"
                :id="'poll-option-' + index"
                name="pollOption"
                class="mcq__option-input"
                :disabled="pollAnswered"
                @click="selectAnswer($event, index)"
                @keydown="handleKeyDown($event, index)"
              />
              <label :for="'poll-option-' + index" class="mcq__option-label">
                <span class="mcq__option-letter">{{ getLabel(index) }}</span>
                <span class="mcq__option-text">{{ option.option }}</span>
              </label>
            </div>
          </div>
        </div>
        <div v-if="showImages && poll.background_image && poll.background_image.url" class="poll__image">
          <img :src="poll.background_image.url" :alt="poll.background_image.alt" class="poll__img" />
        </div>
      </div>

      <feedback-panel
        :visible="showFeedback"
        type="poll"
        icon="👍"
        :title="poll.feedback_title"
        :text="poll.feedback_text"
        :cta-text="poll.submit_cta_text"
        :disabled="isProcessingNext"
        @next="finish"
      />
    </section>
  `,
};
