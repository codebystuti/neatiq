const McqQuestion = {
  name: 'McqQuestion',

  props: {
    question:      { type: Object, required: true },
    questionIndex: { type: Number, required: true },
    showImages:    { type: Boolean, default: true },
    instantFeedback: { type: Boolean, default: true },
    isLastQuestion: { type: Boolean, default: false },
  },

  emits: ['answered'],

  data() {
    return {
      isAnswered: false,
      selectedOptionIndex: null,
      revealCorrect: false,
      showCorrectPanel: false,
      showIncorrectPanel: false,
      isProcessingNext: false,
    };
  },

  computed: {
    correctIndex() {
      return this.question.options?.findIndex(o => o.is_true) ?? -1;
    },
    hasImage() {
      return this.showImages && this.question.background_image && this.question.background_image.url;
    },
    ctaLabel() {
      if (this.isLastQuestion) return 'See My Results';
      return this.question.submit_cta_text || 'Next Question';
    },
  },

  methods: {
    getLabel(index) {
      return String.fromCharCode(65 + index);
    },

    isCorrectOption(optIdx) {
      if (!this.revealCorrect) return false;
      return this.correctIndex === optIdx;
    },

    selectAnswer(option, index) {
      if (this.isAnswered) return;
      this.isAnswered = true;
      const allOpts = this.$el.querySelectorAll('.mcq__option');
      allOpts.forEach(el => el.classList.add('mcq__option--locked'));
      this.$el.querySelectorAll('.mcq__option-input')
        .forEach(el => { el.disabled = true; el.style.pointerEvents = 'none'; });

      const isCorrect = index === this.correctIndex;

      if (isCorrect) {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          this.selectedOptionIndex = index;
          this.revealCorrect = true;
        }));
        if (this.instantFeedback) {
          setTimeout(() => { this.showCorrectPanel = true; }, 1800);
        } else {
          setTimeout(() => {
            this.revealCorrect = false;
            this.selectedOptionIndex = -1;
            setTimeout(() => this.emitAnswer(isCorrect), 300);
          }, 1200);
        }
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          this.selectedOptionIndex = index;
        }));
        setTimeout(() => { this.revealCorrect = true; }, 1000);
        if (this.instantFeedback) {
          setTimeout(() => { this.showIncorrectPanel = true; }, 1800);
        } else {
          setTimeout(() => {
            this.revealCorrect = false;
            this.selectedOptionIndex = -1;
            setTimeout(() => this.emitAnswer(isCorrect), 300);
          }, 1600);
        }
      }
    },

    emitAnswer(isCorrect) {
      this.$emit('answered', {
        questionIndex: this.questionIndex,
        questionType: 'multiple_choice',
        question: this.question.question,
        userAnswer: this.question.options[this.selectedOptionIndex]?.option,
        correctAnswer: this.question.options[this.correctIndex]?.option,
        isCorrect,
      });
    },

    nextQuestion() {
      if (this.isProcessingNext) return;
      this.isProcessingNext = true;
      const isCorrect = this.selectedOptionIndex === this.correctIndex;
      // hide the panel first, then emit after it slides out
      this.showCorrectPanel = false;
      this.showIncorrectPanel = false;

      setTimeout(() => {
        this.emitAnswer(isCorrect);
        this.isProcessingNext = false;
      }, 900);
    },

    handleKeyDown(event, index) {
      if (this.isAnswered) return;
      const len = this.question.options.length;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        const next = (index + 1) % len;
        this.$el.querySelector('#option-' + this.questionIndex + '-' + next)?.focus();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const prev = (index - 1 + len) % len;
        this.$el.querySelector('#option-' + this.questionIndex + '-' + prev)?.focus();
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.selectAnswer(this.question.options[index], index);
      }
    },
  },

  template: `
    <section class="mcq" :aria-label="'Question ' + (questionIndex + 1)">
      <div class="mcq__inner container" :class="{ 'mcq__inner--split': hasImage }">

        <div class="mcq__left">
          <h2 class="mcq__question" v-html="question.question"></h2>
          <div class="mcq__options">
            <div
              v-for="(option, index) in question.options"
              :key="index"
              :id="'button-mcq-' + questionIndex + '-' + index"
              class="mcq__option"
              :class="{
                'mcq__option--correct':   isAnswered && isCorrectOption(index),
                'mcq__option--incorrect': isAnswered && selectedOptionIndex === index && !isCorrectOption(index)
              }"
            >
              <input
                type="radio"
                :id="'option-' + questionIndex + '-' + index"
                :name="'question-' + questionIndex"
                class="mcq__option-input"
                :disabled="isAnswered"
                @keydown="handleKeyDown($event, index)"
                @click="selectAnswer(option, index)"
              />
              <label :for="'option-' + questionIndex + '-' + index" class="mcq__option-label">
                <span class="mcq__option-letter">{{ getLabel(index) }}</span>
                <span class="mcq__option-text">{{ option.option }}</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="hasImage" class="mcq__right">
          <img class="mcq__img" :src="question.background_image.url" :alt="question.background_image.alt" />
        </div>
      </div>

      <feedback-panel
        :visible="showIncorrectPanel"
        type="incorrect"
        :title="question.incorrect_answer_title"
        :text="question.incorrect_answer_text"
        :cta-text="ctaLabel"
        :disabled="isProcessingNext"
        @next="nextQuestion"
      />

      <feedback-panel
        :visible="showCorrectPanel"
        type="correct"
        :title="question.correct_answer_title"
        :text="question.correct_answer_text"
        :cta-text="ctaLabel"
        :disabled="isProcessingNext"
        @next="nextQuestion"
      />
    </section>
  `,
};