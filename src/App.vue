<template>
  <canvas
    v-show="showConfetti"
    class="absolute z-50 cursor-not-allowed bg-gray-400/20 h-screen w-screen"
    id="my-canvas"
    width="0"
    height="0"
  ></canvas>
  <div class="h-screen relative" :class="currentBackground">
    <Header :score="score" :life="life" />
    <div class="my-8">
      <Gallery :imageURLs="imageURLs" />
    </div>

    <!-- guess section -->
    <section class="flex justify-center text-gray-200 font-bold text-2xl gap-4">
      <p
        v-for="(alphabet, index) in guess"
        :key="index"
        @click="currentGuessIndex = index"
        class="bg-gray-700 h-10 w-10 cursor-pointer rounded-md uppercase flex justify-center items-center"
        :class="
          currentGuessIndex === index
            ? 'border-gray-600 border-2 shadow-gray-400 shadow-md'
            : ''
        "
      >
        {{ alphabet }}
      </p>
      <CheckIcon
        v-if="canCheckAnswer"
        @click="checkAnswer"
        class="w-10 h-10 p-2 text-gray-100 cursor-pointer bg-yellow-600 rounded-full"
      />
    </section>

    <!-- guessing options -->
    <div class="py-8 flex items-center justify-center">
      <section
        class="grid grid-cols-9 grid-rows-2 text-gray-600 font-bold text-2xl gap-4"
      >
        <button
          v-for="(alphabet, index) in availableAlphabets"
          :key="index"
          @click="chooseAlphabet(alphabet, index)"
          class="bg-white hover:bg-gray-600 hover:text-white p-2 text-center cursor-pointer uppercase rounded-md disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed"
          :disabled="alphabet.order !== null"
        >
          {{ alphabet.value }}
        </button>
      </section>
    </div>

    <!-- menu -->
    <section class="fixed bottom-4 right-10">
      <div class="flex flex-col gap-6">
        <ChartBarIcon
          @click="getLeaderbaord"
          class="w-14 h-14 p-2 text-gray-400 cursor-pointer bg-gray-700 rounded-full"
        />
        <Cog6ToothIcon
          @click="showSettingsModal = true"
          class="w-14 h-14 p-2 text-gray-400 cursor-pointer bg-gray-700 rounded-full"
        />
      </div>
    </section>

    <!-- chatbot -->
    <section class="absolute bottom-10 left-10">
      <iframe
        allow="microphone;"
        width="350"
        height="430"
        src="https://console.dialogflow.com/api-client/demo/embedded/7aa61555-190f-4ea4-8806-5764f2b59a58?expanded=false">
      </iframe>
    </section>
  </div>

  <!-- leaderboard scores -->
  <Modal v-if="showLeaderboardModal" @ok="showLeaderboardModal = false">
    <section class="w-96">
      <h1 class="text-gray-700 font-bold text-2xl mb-4">Leaderboard</h1>
      <table class="w-full table-fixed text-xs border border-gray-400 shadow-md">
        <thead>
          <tr>
            <th class="w-1/6 py-2">#</th>
            <th class="w-2/3 py-2">Player</th>
            <th class="w-1/6 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in leaderboard" :key="player.name">
            <td class="border border-gray-400 px-4 py-2">{{ index + 1 }}</td>
            <td class="border border-gray-400 px-4 py-2">{{ player.player }}</td>
            <td class="border border-gray-400 px-4 py-2">{{ player.score }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </Modal>

  <!-- settings modal -->
  <Modal v-if="showSettingsModal" @ok="saveSettings">
    <section class="w-96">
      <h1 class="text-gray-700 font-bold text-2xl mb-4">Game settings</h1>
      <div class="text-left">
        <label for="level-select" class="block font-medium text-gray-700 mb-2"
          >Select a level:</label
        >
        <select
          id="level-select"
          v-model="currentLevel"
          class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="(level, key) in levels" :value="level" :key="key">
            {{ level }}
          </option>
        </select>

        <label
          for="color-select"
          class="block font-medium text-gray-700 mt-4 mb-2"
          >Select a background color:</label
        >
        <select
          id="color-select"
          v-model="currentBackground"
          class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option
            v-for="color in availableBackgrounds"
            :key="color"
            :value="color"
            :class="color"
            class="py-2 h-4"
          >
            {{ color }}
          </option>
        </select>
      </div>
    </section>
  </Modal>

  <!-- game start modal -->
  <Modal v-if="showGameStartModal" @ok="playGame">
    <section class="w-96">
      <h1 class="text-gray-700 font-bold text-2xl">
        Start game!
      </h1>

      <p>Enter your name</p>
      <input
        v-model="playerName"
        class="border rounded-md h-10 px-4 text-gray-600 font-bold"
      />
    </section>
  </Modal>
</template>

<script setup>
import {
  ChartBarIcon,
  Cog6ToothIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";
import Header from "./components/Header.vue";
import Gallery from "./components/Gallery.vue";
import Modal from "./components/Modal.vue";
import { unsplash } from "./service/unsplash";
import { computed, onMounted, ref } from "vue";
import { generate } from "./utils/wordGenerator";
import ConfettiGenerator from "confetti-js";
import correctSound from "./assets/correct-answer.mp3";
import wrongSound from "./assets/wrong-answer.mp3";
import clickSound from "./assets/click.mp3";
import axios from "axios";

const imageURLs = ref([])
const BACKEND_API_URL = "http://localhost:3000/"

// game settings and controls
const levels = ref({
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
  ENGLISH: "ENGLISH",
  GEOGRAPHY: "GEOGRAPHY",
  MATHS: "MATHS",

});
const currentLevel = ref(levels.value.EASY);
const MAX_LIFE = 5;
const REWARD_POINTS = 1000;
const RANDOM_ALPHABETS_AMOUNT = 18;
const life = ref(MAX_LIFE);

const word = ref("");
const score = ref(0);
const availableAlphabets = ref([]);
const guess = ref([]);
const currentGuessIndex = ref(0);
const showConfetti = ref(false);
const showGameStartModal = ref(true);

// functionality related to high-scores and leaderboard
const leaderboard = ref([]);
const playerName = ref("");
const showLeaderboardModal = ref(false);

// functionality related to game settings
const showSettingsModal = ref(false);
const availableBackgrounds = ref([
  "bg-gray-900",
  "bg-red-700",
  "bg-orange-500",
  "bg-amber-400",
  "bg-lime-500",
  "bg-green-500",
  "bg-teal-700",
  "bg-cyan-500",
  "bg-rose-600",
]);
const currentBackground = ref("bg-gray-900");

const canCheckAnswer = computed(() => {
  return guess.value.join("").length === word.value.length;
});

const randomIndex = (end) => {
  return Math.floor(Math.random() * end);
};

const getRandomAlphabets = () => {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  let result = [];
  let remaining = RANDOM_ALPHABETS_AMOUNT - word.value.length

  // add alphabets from the target word
  for (let i = 0; i < word.value.length; i++) {
    result.push({
      value: word.value[i],
      order: null
    });
  }

  // fill all the remaining boxes with random alphabets
  for (let i = 0; i < remaining; i++) {
    let index = randomIndex(alphabets.length);
    const randomAlphabet = alphabets[index];
    result.push({
      value: randomAlphabet,
      order: null
    });
  }

  // randomize the available alphabets
  
  return result.sort(() => Math.random() - 0.5);
};

const chooseAlphabet = (alphabet, index) => {
  new Audio(clickSound).play();
  // check if an alphabet was already in the box, if so, remove that alphabet
  availableAlphabets.value.forEach((element) => {
    if (element.order === currentGuessIndex.value) {
      element.order = null;
    }
  });
  availableAlphabets.value[index].order = currentGuessIndex.value;
  guess.value[currentGuessIndex.value] = alphabet.value;

  if (currentGuessIndex.value < word.value.length - 1) {
    currentGuessIndex.value += 1;
  }
};

const checkAnswer = () => {
  showConfetti.value = true;

  let win =
    guess.value.join("").toLowerCase() === word.value.toLocaleLowerCase();

  if (win) {
    new Audio(correctSound).play();
    // add score
    score.value += REWARD_POINTS;

    // show confetti
    var confettiSettings = {
      target: "my-canvas",
      size: 2,
      props: ["circle", "square", "triangle", "line"],
      respawn: false,
      clock: 200,
    };
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    setTimeout(() => {
      confetti.clear();
      showConfetti.value = false;
    }, 2000);

    // reinitialize the game
    init();
  } else {
    life.value -= 1;

    new Audio(wrongSound).play();
    setTimeout(() => {
      showConfetti.value = false;

      // if no life is left, ask user to add their name for leadersboard if their score is eligible for leaderboard
      if (life.value === 0 && score.value) {
        showGameStartModal.value = true;
        addToLeaderboard()
      }
    }, 2000);
  }
};

const addToLeaderboard = async () => {
  const payload = { player: playerName.value, score: score.value };
  let url = BACKEND_API_URL + 'leaderboard'

  await axios.post(url, payload)
  leaderboard.value.push(payload);
};

const getLeaderbaord = async () => {
  let url = BACKEND_API_URL + 'leaderboard'
  let response = await axios.get(url)

  leaderboard.value = response.data
  showLeaderboardModal.value = true
}

const saveSettings = () => {
  init()
  showSettingsModal.value = false;
};

const playGame = () => {
  if (playerName.value) {
    showGameStartModal.value = false;
    score.value = 0;
    init();
  }
};

const init = async () => {
  word.value = generate(currentLevel.value);
  guess.value = [];
  currentGuessIndex.value = 0;
  availableAlphabets.value = [];
  imageURLs.value = []

  // set life to max lifes
  life.value = MAX_LIFE;

  // initialize guess with dashes
  console.log("target word: ", word.value);

  guess.value = [];
  for (let i = 0; i < word.value.length; i++) {
    guess.value.push("");
  }

  // set current index of guess
  currentGuessIndex.value = 0;

  let { response } = await unsplash.search.getPhotos({
    // query: 'apple',
    query: word.value,
    page: 1,
    perPage: 4
  })

  response.results.forEach((image) => {
    // imageURLs.value.push(image.urls.full)
    imageURLs.value.push(image.urls.small)
  })

  availableAlphabets.value = getRandomAlphabets();
};

</script>
