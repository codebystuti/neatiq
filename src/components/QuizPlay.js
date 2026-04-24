const QuizPlay = {
  name: 'QuizPlay',

  components: {
    QuizProgress,
    McqQuestion,
    DragDropQuestion,
    PollQuestion,
    FeedbackPanel,
  },

  inject: ['store'],

  data() {
    return {
      questions: [],
      pollQuestions: [],
      currentIndex: 0,
      phase: 'questions',   // 'questions' | 'poll'
      totalScore: 0,
      error: null,
    };
  },

  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex] || {};
    },
    totalQuestions() {
      return this.questions.length;
    },
    settings() {
      return this.store.settings;
    },
  },

  created() {
    this.initQuiz();
  },

  methods: {
    initQuiz() {
      if (typeof QUIZ_DATA === 'undefined' || !QUIZ_DATA.questions) {
        this.error = 'Quiz data could not be loaded. Please refresh the page.';
        this.store.setError(this.error);
        return;
      }

      if (!QUIZ_DATA.questions.length) {
        this.error = 'No questions available.';
        this.store.setError(this.error);
        return;
      }

      this.pollQuestions = QUIZ_DATA.poll_questions || [];
      const count = this.settings.questionCount;
      const all = [...QUIZ_DATA.questions];
      const featured = all.filter(q => q.is_featured_question === true);
      const nonFeatured = all.filter(q => !q.is_featured_question);

      // C# OrderBy(x => random.Next())
      const shuffledNonFeatured = nonFeatured
        .map(q => ({ q, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(x => x.q);

      const nonFeaturedNeeded = Math.max(0, count - featured.length);
      const selected = [...featured, ...shuffledNonFeatured.slice(0, nonFeaturedNeeded)];
      this.questions = selected.slice(0, count);

      this.totalScore = 0;
      this.currentIndex = 0;
      this.phase = 'questions';
      this.error = null;
    },

    onQuestionAnswered(response) {
      this.store.addResponse({
        ...response,
        questionNumber: this.currentIndex + 1,
        answeredAt: new Date().toISOString(),
      });

      if (response.isCorrect) this.totalScore++;

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (this.pollQuestions.length > 0) {
          this.phase = 'poll';
        } else {
          this.finishQuiz();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    onPollCompleted(pollResponse) {
      this.store.addResponse(pollResponse);
      this.finishQuiz();
    },

    finishQuiz() {
      const scoreOutOf10 = this.calcScoreOutOf10();
      const level = scoreOutOf10 === 10 ? 'extreme'
                  : scoreOutOf10 >= 7  ? 'high'
                  : scoreOutOf10 >= 4  ? 'moderate'
                  : 'beginner';

      // save final score to the shared store
      this.store.setFinalScore({
        score: this.totalScore,
        totalQuestions: this.totalQuestions,
        scoreOutOf10,
        level,
        completedAt: new Date().toISOString(),
      });

      setTimeout(() => {
        this.$router.push({
          name: 'results',
        });
      }, 400);
    },

    calcScoreOutOf10() {
      if (!this.totalQuestions) return 0;
      if (this.totalScore === this.totalQuestions) return 10;
      return Math.min(Math.round((this.totalScore / this.totalQuestions) * 10), 9);
    },
  },

  template: `
    <div aria-live="polite" aria-atomic="false">

      <!-- Error state -->
      <div v-if="error" class="quiz-error" role="alert">
        <p>{{ error }}</p>
        <button class="btn btn--outline" style="margin-top: 16px;" @click="$router.push({ name: 'landing' })">
          Back to Home
        </button>
      </div>

      <template v-else>
        <!-- Progress bar -->
        <transition name="fade-progress">
          <quiz-progress
            v-if="phase === 'questions'"
            :current="currentIndex + 1"
            :total="totalQuestions"
          />
        </transition>

        <!-- Question area with transition between questions -->
        <transition name="question-slide" mode="out-in">

          <div v-if="phase === 'questions'" :key="'q-' + currentIndex">
            <mcq-question
              v-if="currentQuestion.question_type === 'multiple_choice'"
              :question="currentQuestion"
              :question-index="currentIndex"
              :show-images="settings.showImages"
              :instant-feedback="settings.instantFeedback"
              :is-last-question="currentIndex === questions.length - 1"
              @answered="onQuestionAnswered"
            />

            <drag-drop-question
              v-else-if="currentQuestion.question_type === 'drag_drop'"
              :question="currentQuestion"
              :question-index="currentIndex"
              :instant-feedback="settings.instantFeedback"
              :is-last-question="currentIndex === questions.length - 1"
              @answered="onQuestionAnswered"
            />
          </div>

          <poll-question
            v-else-if="phase === 'poll'"
            key="poll"
            :poll="pollQuestions[0]"
            :show-images="settings.showImages"
            @completed="onPollCompleted"
          />

        </transition>
      </template>
    </div>
  `,
};