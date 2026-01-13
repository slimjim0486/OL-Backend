/**
 * Sample Lessons - Pre-computed lesson content for new users
 *
 * These lessons are static (no AI processing needed) and allow children
 * to immediately start learning without waiting for parent uploads.
 *
 * Categories:
 * - YOUNG (ages 4-7): Grades K-2
 * - OLDER (ages 8-12): Grades 3-6
 *
 * Subjects covered: Math, Science, English
 */

export interface SampleVocabulary {
  term: string;
  definition: string;
  example?: string;
}

export interface SampleFlashcard {
  front: string;
  back: string;
  hint?: string;
}

export interface SampleQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface SampleLesson {
  id: string;
  title: string;
  summary: string;
  subject: 'MATH' | 'SCIENCE' | 'ENGLISH';
  gradeLevel: string;
  ageGroup: 'YOUNG' | 'OLDER';
  estimatedMinutes: number;
  icon: string;
  thumbnail?: string;
  extractedText: string;
  keyConcepts: string[];
  vocabulary: SampleVocabulary[];
  suggestedQuestions: string[];
  flashcards: SampleFlashcard[];
  quiz: SampleQuizQuestion[];
}

// ============================================================
// MATH LESSONS
// ============================================================

const mathYoung: SampleLesson = {
  id: 'sample-math-young-001',
  title: 'Counting Fun with Animals',
  summary: 'Learn to count from 1 to 10 with cute animal friends!',
  subject: 'MATH',
  gradeLevel: 'K-1',
  ageGroup: 'YOUNG',
  estimatedMinutes: 5,
  icon: '🔢',
  extractedText: `
<div class="lesson-content young-reader">
  <h1>🐾 Counting Fun with Animals! 🐾</h1>

  <div class="intro-box">
    <p>Let's count together! We'll meet some animal friends along the way.</p>
  </div>

  <h2>🐶 One Dog</h2>
  <p class="big-text">1 - ONE</p>
  <p>There is <strong>one</strong> happy dog wagging its tail!</p>

  <h2>🐱🐱 Two Cats</h2>
  <p class="big-text">2 - TWO</p>
  <p>There are <strong>two</strong> fluffy cats playing with yarn!</p>

  <h2>🐰🐰🐰 Three Bunnies</h2>
  <p class="big-text">3 - THREE</p>
  <p>There are <strong>three</strong> soft bunnies hopping around!</p>

  <h2>🐦🐦🐦🐦 Four Birds</h2>
  <p class="big-text">4 - FOUR</p>
  <p>There are <strong>four</strong> colorful birds singing in a tree!</p>

  <h2>🐠🐠🐠🐠🐠 Five Fish</h2>
  <p class="big-text">5 - FIVE</p>
  <p>There are <strong>five</strong> sparkly fish swimming in the pond!</p>

  <h2>Let's Keep Going!</h2>
  <ul class="counting-list">
    <li><strong>6 - SIX</strong> 🦋🦋🦋🦋🦋🦋 butterflies</li>
    <li><strong>7 - SEVEN</strong> 🐸🐸🐸🐸🐸🐸🐸 frogs</li>
    <li><strong>8 - EIGHT</strong> 🐢🐢🐢🐢🐢🐢🐢🐢 turtles</li>
    <li><strong>9 - NINE</strong> 🦆🦆🦆🦆🦆🦆🦆🦆🦆 ducks</li>
    <li><strong>10 - TEN</strong> 🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝 bees</li>
  </ul>

  <div class="fun-fact">
    <h3>🌟 Great Job!</h3>
    <p>You can count from 1 to 10! Try counting things around you!</p>
  </div>
</div>
  `,
  keyConcepts: ['counting', 'numbers 1-10', 'one-to-one correspondence'],
  vocabulary: [
    { term: 'Count', definition: 'To say numbers in order', example: '1, 2, 3, 4, 5...' },
    { term: 'Number', definition: 'A symbol that tells how many', example: '5 is a number' },
    { term: 'One', definition: 'The first number when we count', example: 'One dog' },
  ],
  suggestedQuestions: [
    'How many cats are there?',
    'What comes after 5?',
    'Can you count to 10?',
  ],
  flashcards: [
    { front: 'How many? 🐶', back: '1 - One', hint: 'Count the dogs' },
    { front: 'How many? 🐱🐱', back: '2 - Two', hint: 'Count the cats' },
    { front: 'How many? 🐰🐰🐰', back: '3 - Three', hint: 'Count the bunnies' },
    { front: 'What number comes after 4?', back: '5 - Five' },
    { front: 'What number comes before 10?', back: '9 - Nine' },
  ],
  quiz: [
    {
      question: 'How many cats are in the lesson?',
      options: ['1', '2', '3', '4'],
      correctIndex: 1,
      explanation: 'There are 2 cats playing with yarn!',
    },
    {
      question: 'What number comes after 7?',
      options: ['6', '7', '8', '9'],
      correctIndex: 2,
      explanation: '8 comes after 7. Count: 6, 7, 8!',
    },
    {
      question: 'How many fish are swimming?',
      options: ['3', '4', '5', '6'],
      correctIndex: 2,
      explanation: 'There are 5 sparkly fish in the pond!',
    },
  ],
};

const mathOlder: SampleLesson = {
  id: 'sample-math-older-001',
  title: 'Multiplication Made Easy',
  summary: 'Master the times tables with tricks and patterns!',
  subject: 'MATH',
  gradeLevel: 'Grade 3-4',
  ageGroup: 'OLDER',
  estimatedMinutes: 8,
  icon: '✖️',
  extractedText: `
<div class="lesson-content">
  <h1>✖️ Multiplication Made Easy!</h1>

  <div class="intro-box">
    <p>Multiplication is just a faster way to add the same number many times. Let's learn some cool tricks!</p>
  </div>

  <h2>What is Multiplication?</h2>
  <p>When we multiply, we add a number to itself multiple times:</p>
  <div class="example-box">
    <p><strong>3 × 4 = ?</strong></p>
    <p>This means: 3 + 3 + 3 + 3 = 12</p>
    <p>Or: 4 + 4 + 4 = 12</p>
    <p>So: <strong>3 × 4 = 12</strong></p>
  </div>

  <h2>The 2 Times Table</h2>
  <p>Multiplying by 2 is like <strong>doubling</strong> a number:</p>
  <ul>
    <li>2 × 1 = 2 (1 + 1)</li>
    <li>2 × 2 = 4 (2 + 2)</li>
    <li>2 × 3 = 6 (3 + 3)</li>
    <li>2 × 4 = 8 (4 + 4)</li>
    <li>2 × 5 = 10 (5 + 5)</li>
  </ul>

  <h2>The 5 Times Table</h2>
  <p>The 5 times table has a pattern - answers always end in <strong>0 or 5</strong>:</p>
  <ul>
    <li>5 × 1 = 5</li>
    <li>5 × 2 = 10</li>
    <li>5 × 3 = 15</li>
    <li>5 × 4 = 20</li>
    <li>5 × 5 = 25</li>
  </ul>
  <p><em>Trick: Count by 5s on your fingers!</em></p>

  <h2>The 10 Times Table</h2>
  <p>This is the easiest! Just add a <strong>zero</strong> to any number:</p>
  <ul>
    <li>10 × 3 = 30</li>
    <li>10 × 7 = 70</li>
    <li>10 × 9 = 90</li>
  </ul>

  <h2>The 9 Times Table Trick</h2>
  <p>Use your fingers! Hold up 10 fingers, then put down the finger for the number you're multiplying by 9:</p>
  <div class="tip-box">
    <p><strong>9 × 4:</strong> Put down finger #4</p>
    <p>Fingers before it: 3 | Fingers after it: 6</p>
    <p>Answer: <strong>36</strong></p>
  </div>

  <h2>Practice Problems</h2>
  <ol>
    <li>4 × 3 = ?</li>
    <li>5 × 6 = ?</li>
    <li>2 × 8 = ?</li>
    <li>10 × 4 = ?</li>
  </ol>

  <div class="answer-key">
    <p><em>Answers: 12, 30, 16, 40</em></p>
  </div>
</div>
  `,
  keyConcepts: ['multiplication', 'times tables', 'skip counting', 'patterns'],
  vocabulary: [
    { term: 'Multiply', definition: 'To add a number to itself a certain number of times', example: '3 × 4 means add 3 four times' },
    { term: 'Product', definition: 'The answer when you multiply two numbers', example: 'The product of 3 × 4 is 12' },
    { term: 'Times Table', definition: 'A list showing multiplication facts for a number', example: 'The 5 times table: 5, 10, 15, 20...' },
    { term: 'Factor', definition: 'A number that is multiplied', example: 'In 3 × 4, both 3 and 4 are factors' },
  ],
  suggestedQuestions: [
    'What is 6 × 5?',
    'How can you use the 10 times table trick?',
    'What pattern do you notice in the 5 times table?',
  ],
  flashcards: [
    { front: '3 × 4 = ?', back: '12', hint: 'Add 3 four times: 3+3+3+3' },
    { front: '5 × 7 = ?', back: '35', hint: 'Count by 5s: 5, 10, 15, 20, 25, 30, 35' },
    { front: '10 × 8 = ?', back: '80', hint: 'Add a zero to 8' },
    { front: '9 × 6 = ?', back: '54', hint: 'Use the finger trick!' },
    { front: '2 × 9 = ?', back: '18', hint: 'Double 9' },
  ],
  quiz: [
    {
      question: 'What is 4 × 5?',
      options: ['15', '20', '25', '30'],
      correctIndex: 1,
      explanation: '4 × 5 = 20. You can count by 5s: 5, 10, 15, 20!',
    },
    {
      question: 'What is 10 × 6?',
      options: ['16', '60', '66', '100'],
      correctIndex: 1,
      explanation: 'When multiplying by 10, just add a zero! 6 → 60',
    },
    {
      question: 'What pattern do answers in the 5 times table follow?',
      options: ['End in 0 or 5', 'Always even', 'Always odd', 'End in 1 or 2'],
      correctIndex: 0,
      explanation: 'The 5 times table always ends in 0 or 5: 5, 10, 15, 20, 25...',
    },
  ],
};

// ============================================================
// SCIENCE LESSONS
// ============================================================

const scienceYoung: SampleLesson = {
  id: 'sample-science-young-001',
  title: 'The Five Senses',
  summary: 'Discover how we use our eyes, ears, nose, tongue, and skin!',
  subject: 'SCIENCE',
  gradeLevel: 'K-2',
  ageGroup: 'YOUNG',
  estimatedMinutes: 5,
  icon: '🔬',
  extractedText: `
<div class="lesson-content young-reader">
  <h1>👀 Our Five Amazing Senses! 👂</h1>

  <div class="intro-box">
    <p>We have FIVE special senses that help us understand the world around us!</p>
  </div>

  <h2>👀 Sight - Our Eyes</h2>
  <p>We use our <strong>eyes</strong> to SEE!</p>
  <p>We can see:</p>
  <ul>
    <li>🌈 Colors - red, blue, green, yellow</li>
    <li>📐 Shapes - circles, squares, triangles</li>
    <li>👨‍👩‍👧 People - our family and friends</li>
  </ul>

  <h2>👂 Hearing - Our Ears</h2>
  <p>We use our <strong>ears</strong> to HEAR!</p>
  <p>We can hear:</p>
  <ul>
    <li>🎵 Music and songs</li>
    <li>🐕 A dog barking</li>
    <li>💬 People talking</li>
  </ul>

  <h2>👃 Smell - Our Nose</h2>
  <p>We use our <strong>nose</strong> to SMELL!</p>
  <p>We can smell:</p>
  <ul>
    <li>🌸 Flowers</li>
    <li>🍪 Yummy cookies baking</li>
    <li>🍋 A fresh lemon</li>
  </ul>

  <h2>👅 Taste - Our Tongue</h2>
  <p>We use our <strong>tongue</strong> to TASTE!</p>
  <p>Things can taste:</p>
  <ul>
    <li>🍬 Sweet - like candy</li>
    <li>🍋 Sour - like lemons</li>
    <li>🧂 Salty - like chips</li>
    <li>🥦 Bitter - like some vegetables</li>
  </ul>

  <h2>🖐️ Touch - Our Skin</h2>
  <p>We use our <strong>skin</strong> to TOUCH and feel!</p>
  <p>Things can feel:</p>
  <ul>
    <li>🧸 Soft - like a teddy bear</li>
    <li>🪨 Hard - like a rock</li>
    <li>🥶 Cold - like ice cream</li>
    <li>☀️ Warm - like sunshine</li>
  </ul>

  <div class="fun-fact">
    <h3>🌟 Did You Know?</h3>
    <p>Your tongue has about 10,000 tiny taste buds!</p>
  </div>
</div>
  `,
  keyConcepts: ['five senses', 'sight', 'hearing', 'smell', 'taste', 'touch'],
  vocabulary: [
    { term: 'Senses', definition: 'The ways our body learns about the world', example: 'We have five senses' },
    { term: 'Sight', definition: 'The ability to see with our eyes', example: 'I use sight to see a rainbow' },
    { term: 'Hearing', definition: 'The ability to hear sounds with our ears', example: 'I use hearing to listen to music' },
  ],
  suggestedQuestions: [
    'What do we use to smell?',
    'How many senses do we have?',
    'What sense do you use to feel if something is hot or cold?',
  ],
  flashcards: [
    { front: 'What body part do we use to see?', back: 'Eyes 👀' },
    { front: 'What body part do we use to hear?', back: 'Ears 👂' },
    { front: 'What body part do we use to smell?', back: 'Nose 👃' },
    { front: 'What body part do we use to taste?', back: 'Tongue 👅' },
    { front: 'How many senses do we have?', back: 'Five senses!' },
  ],
  quiz: [
    {
      question: 'Which body part do we use to see?',
      options: ['Ears', 'Eyes', 'Nose', 'Tongue'],
      correctIndex: 1,
      explanation: 'We use our EYES to see colors, shapes, and people!',
    },
    {
      question: 'How many senses do we have?',
      options: ['3', '4', '5', '6'],
      correctIndex: 2,
      explanation: 'We have 5 senses: sight, hearing, smell, taste, and touch!',
    },
    {
      question: 'Which sense helps us know if food tastes sweet or salty?',
      options: ['Sight', 'Touch', 'Taste', 'Smell'],
      correctIndex: 2,
      explanation: 'We use our sense of TASTE to know if food is sweet, salty, sour, or bitter!',
    },
  ],
};

const scienceOlder: SampleLesson = {
  id: 'sample-science-older-001',
  title: 'The Solar System',
  summary: 'Explore our cosmic neighborhood - the Sun and all the planets!',
  subject: 'SCIENCE',
  gradeLevel: 'Grade 3-5',
  ageGroup: 'OLDER',
  estimatedMinutes: 10,
  icon: '🌍',
  extractedText: `
<div class="lesson-content">
  <h1>🌌 The Solar System</h1>

  <div class="intro-box">
    <p>Our solar system is like a cosmic family, with the Sun at the center and eight planets orbiting around it!</p>
  </div>

  <h2>☀️ The Sun - Our Star</h2>
  <p>The Sun is a giant ball of hot, glowing gas at the center of our solar system. It's so big that you could fit over 1 million Earths inside it!</p>
  <ul>
    <li>The Sun provides light and heat to all the planets</li>
    <li>It's about 93 million miles from Earth</li>
    <li>The Sun is approximately 4.6 billion years old</li>
  </ul>

  <h2>🪐 The Eight Planets</h2>
  <p>Here are the planets in order from the Sun:</p>

  <h3>1. Mercury ☿️</h3>
  <p>The smallest planet and closest to the Sun. It's very hot during the day and freezing at night!</p>

  <h3>2. Venus ♀️</h3>
  <p>The hottest planet! Its thick clouds trap heat. Venus is sometimes called Earth's "twin" because they're similar in size.</p>

  <h3>3. Earth 🌍</h3>
  <p>Our home! The only planet known to have life. Earth has water, oxygen, and the perfect temperature for living things.</p>

  <h3>4. Mars 🔴</h3>
  <p>The "Red Planet" because of its rusty red soil. Scientists are exploring Mars with robots called rovers!</p>

  <h3>5. Jupiter 🟠</h3>
  <p>The largest planet - over 1,000 Earths could fit inside! It has a famous Great Red Spot, which is actually a giant storm.</p>

  <h3>6. Saturn 🪐</h3>
  <p>Famous for its beautiful rings made of ice and rock. Saturn is so light it could float in water!</p>

  <h3>7. Uranus 🔵</h3>
  <p>An "ice giant" that spins on its side. It appears blue-green due to methane in its atmosphere.</p>

  <h3>8. Neptune 💙</h3>
  <p>The windiest planet with storms faster than any on Earth. It's the farthest planet from the Sun.</p>

  <div class="remember-box">
    <h3>🧠 Remember the Order!</h3>
    <p><strong>M</strong>y <strong>V</strong>ery <strong>E</strong>xcellent <strong>M</strong>other <strong>J</strong>ust <strong>S</strong>erved <strong>U</strong>s <strong>N</strong>achos</p>
    <p>(Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)</p>
  </div>

  <h2>Other Objects in Our Solar System</h2>
  <ul>
    <li><strong>Dwarf Planets:</strong> Pluto, Ceres, and others</li>
    <li><strong>Moons:</strong> Natural satellites that orbit planets</li>
    <li><strong>Asteroids:</strong> Rocky objects, mostly between Mars and Jupiter</li>
    <li><strong>Comets:</strong> Icy objects with beautiful tails when near the Sun</li>
  </ul>
</div>
  `,
  keyConcepts: ['solar system', 'planets', 'Sun', 'orbit', 'gravity'],
  vocabulary: [
    { term: 'Solar System', definition: 'The Sun and all the objects that orbit around it', example: 'Earth is part of our solar system' },
    { term: 'Orbit', definition: 'The curved path an object takes around another object in space', example: 'Earth orbits the Sun once every year' },
    { term: 'Planet', definition: 'A large round object that orbits a star', example: 'Jupiter is the largest planet' },
    { term: 'Star', definition: 'A ball of hot glowing gas in space', example: 'The Sun is our closest star' },
    { term: 'Gravity', definition: 'The force that pulls objects toward each other', example: 'Gravity keeps planets orbiting the Sun' },
  ],
  suggestedQuestions: [
    'Which planet is closest to the Sun?',
    'Why is Mars called the Red Planet?',
    'What makes Saturn special?',
    'How can you remember the order of the planets?',
  ],
  flashcards: [
    { front: 'What is at the center of our solar system?', back: 'The Sun ☀️' },
    { front: 'Which planet is the largest?', back: 'Jupiter 🟠' },
    { front: 'Which planet has famous rings?', back: 'Saturn 🪐' },
    { front: 'Which planet is known as the Red Planet?', back: 'Mars 🔴' },
    { front: 'How many planets are in our solar system?', back: '8 planets' },
    { front: 'Which planet do we live on?', back: 'Earth 🌍' },
  ],
  quiz: [
    {
      question: 'Which planet is closest to the Sun?',
      options: ['Venus', 'Earth', 'Mercury', 'Mars'],
      correctIndex: 2,
      explanation: 'Mercury is the closest planet to the Sun and also the smallest planet!',
    },
    {
      question: 'Which planet is the largest in our solar system?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
      correctIndex: 1,
      explanation: 'Jupiter is so large that over 1,000 Earths could fit inside it!',
    },
    {
      question: 'What keeps the planets orbiting around the Sun?',
      options: ['Wind', 'Magnetism', 'Gravity', 'Heat'],
      correctIndex: 2,
      explanation: 'Gravity is the force that pulls planets toward the Sun and keeps them in orbit!',
    },
    {
      question: 'Which planet has beautiful rings made of ice and rock?',
      options: ['Jupiter', 'Mars', 'Uranus', 'Saturn'],
      correctIndex: 3,
      explanation: 'Saturn is famous for its beautiful ring system made of ice and rock particles!',
    },
  ],
};

// ============================================================
// ENGLISH LESSONS
// ============================================================

const englishYoung: SampleLesson = {
  id: 'sample-english-young-001',
  title: 'ABC Adventure',
  summary: 'Learn the alphabet with fun words and pictures!',
  subject: 'ENGLISH',
  gradeLevel: 'K-1',
  ageGroup: 'YOUNG',
  estimatedMinutes: 5,
  icon: '📖',
  extractedText: `
<div class="lesson-content young-reader">
  <h1>🔤 ABC Adventure! 🔤</h1>

  <div class="intro-box">
    <p>Let's learn the alphabet! Each letter has a special sound and fun words.</p>
  </div>

  <h2>A a - Apple 🍎</h2>
  <p><strong>A</strong> says "ah" like in <strong>apple</strong>!</p>
  <p>More A words: ant, astronaut, airplane</p>

  <h2>B b - Ball ⚽</h2>
  <p><strong>B</strong> says "buh" like in <strong>ball</strong>!</p>
  <p>More B words: baby, bear, butterfly</p>

  <h2>C c - Cat 🐱</h2>
  <p><strong>C</strong> says "kuh" like in <strong>cat</strong>!</p>
  <p>More C words: car, cake, cow</p>

  <h2>D d - Dog 🐕</h2>
  <p><strong>D</strong> says "duh" like in <strong>dog</strong>!</p>
  <p>More D words: duck, door, dinosaur</p>

  <h2>E e - Elephant 🐘</h2>
  <p><strong>E</strong> says "eh" like in <strong>elephant</strong>!</p>
  <p>More E words: egg, ear, eye</p>

  <h2>Let's Keep Going!</h2>
  <ul class="alphabet-list">
    <li><strong>F</strong> - Fish 🐟</li>
    <li><strong>G</strong> - Grape 🍇</li>
    <li><strong>H</strong> - House 🏠</li>
    <li><strong>I</strong> - Ice cream 🍦</li>
    <li><strong>J</strong> - Jellyfish 🪼</li>
  </ul>

  <div class="song-box">
    <h3>🎵 Alphabet Song</h3>
    <p>A B C D E F G</p>
    <p>H I J K L M N O P</p>
    <p>Q R S T U V</p>
    <p>W X Y and Z</p>
    <p>Now I know my ABCs,</p>
    <p>Next time won't you sing with me?</p>
  </div>

  <div class="fun-fact">
    <h3>🌟 Fun Fact!</h3>
    <p>There are 26 letters in the alphabet. The most common letter is E!</p>
  </div>
</div>
  `,
  keyConcepts: ['alphabet', 'letters', 'sounds', 'phonics'],
  vocabulary: [
    { term: 'Alphabet', definition: 'All the letters from A to Z', example: 'The alphabet has 26 letters' },
    { term: 'Letter', definition: 'A symbol we use to write words', example: 'A, B, and C are letters' },
    { term: 'Sound', definition: 'What we hear when we say a letter', example: 'The letter B makes the "buh" sound' },
  ],
  suggestedQuestions: [
    'What letter does "apple" start with?',
    'How many letters are in the alphabet?',
    'Can you name a word that starts with B?',
  ],
  flashcards: [
    { front: 'What letter does Apple start with?', back: 'A 🍎' },
    { front: 'What letter does Ball start with?', back: 'B ⚽' },
    { front: 'What letter does Cat start with?', back: 'C 🐱' },
    { front: 'What letter does Dog start with?', back: 'D 🐕' },
    { front: 'How many letters are in the alphabet?', back: '26 letters!' },
  ],
  quiz: [
    {
      question: 'What letter comes first in the alphabet?',
      options: ['B', 'A', 'C', 'Z'],
      correctIndex: 1,
      explanation: 'A is the first letter of the alphabet!',
    },
    {
      question: 'What letter does "cat" start with?',
      options: ['K', 'S', 'C', 'T'],
      correctIndex: 2,
      explanation: 'Cat starts with the letter C!',
    },
    {
      question: 'How many letters are in the alphabet?',
      options: ['24', '25', '26', '27'],
      correctIndex: 2,
      explanation: 'There are 26 letters in the English alphabet, from A to Z!',
    },
  ],
};

const englishOlder: SampleLesson = {
  id: 'sample-english-older-001',
  title: 'Parts of Speech',
  summary: 'Master nouns, verbs, adjectives, and more!',
  subject: 'ENGLISH',
  gradeLevel: 'Grade 3-5',
  ageGroup: 'OLDER',
  estimatedMinutes: 8,
  icon: '📝',
  extractedText: `
<div class="lesson-content">
  <h1>📝 Parts of Speech</h1>

  <div class="intro-box">
    <p>Words are like puzzle pieces - each type has a special job in a sentence. Let's learn about the main parts of speech!</p>
  </div>

  <h2>1. Nouns - Naming Words</h2>
  <p>A <strong>noun</strong> is a word that names a person, place, thing, or idea.</p>
  <div class="example-box">
    <ul>
      <li><strong>Person:</strong> teacher, doctor, Sarah</li>
      <li><strong>Place:</strong> school, park, Dubai</li>
      <li><strong>Thing:</strong> book, computer, pizza</li>
      <li><strong>Idea:</strong> happiness, freedom, love</li>
    </ul>
  </div>
  <p><em>Example: The <u>dog</u> ran to the <u>park</u>.</em></p>

  <h2>2. Verbs - Action Words</h2>
  <p>A <strong>verb</strong> shows action or a state of being.</p>
  <div class="example-box">
    <ul>
      <li><strong>Action verbs:</strong> run, jump, eat, write, sing</li>
      <li><strong>Being verbs:</strong> is, am, are, was, were</li>
    </ul>
  </div>
  <p><em>Example: She <u>runs</u> every morning. He <u>is</u> happy.</em></p>

  <h2>3. Adjectives - Describing Words</h2>
  <p>An <strong>adjective</strong> describes a noun. It tells us more about it!</p>
  <div class="example-box">
    <ul>
      <li><strong>Size:</strong> big, small, tiny, huge</li>
      <li><strong>Color:</strong> red, blue, green, purple</li>
      <li><strong>Feeling:</strong> happy, sad, excited, scared</li>
      <li><strong>Number:</strong> one, few, many, several</li>
    </ul>
  </div>
  <p><em>Example: The <u>fluffy</u> cat has <u>green</u> eyes.</em></p>

  <h2>4. Adverbs - How, When, Where</h2>
  <p>An <strong>adverb</strong> describes a verb, adjective, or another adverb. Many end in "-ly"!</p>
  <div class="example-box">
    <ul>
      <li><strong>How:</strong> quickly, slowly, carefully, loudly</li>
      <li><strong>When:</strong> yesterday, today, soon, always</li>
      <li><strong>Where:</strong> here, there, everywhere, outside</li>
    </ul>
  </div>
  <p><em>Example: She sings <u>beautifully</u>. They arrived <u>early</u>.</em></p>

  <h2>5. Pronouns - Replacement Words</h2>
  <p>A <strong>pronoun</strong> takes the place of a noun.</p>
  <div class="example-box">
    <p>I, you, he, she, it, we, they, me, him, her, us, them</p>
  </div>
  <p><em>Example: <u>Sarah</u> loves books. → <u>She</u> loves books.</em></p>

  <h2>Quick Reference Chart</h2>
  <table>
    <tr><th>Part of Speech</th><th>Job</th><th>Examples</th></tr>
    <tr><td>Noun</td><td>Names things</td><td>cat, city, idea</td></tr>
    <tr><td>Verb</td><td>Shows action</td><td>run, think, is</td></tr>
    <tr><td>Adjective</td><td>Describes nouns</td><td>big, happy, three</td></tr>
    <tr><td>Adverb</td><td>Describes verbs</td><td>quickly, very, here</td></tr>
    <tr><td>Pronoun</td><td>Replaces nouns</td><td>he, she, they</td></tr>
  </table>
</div>
  `,
  keyConcepts: ['parts of speech', 'nouns', 'verbs', 'adjectives', 'adverbs', 'pronouns'],
  vocabulary: [
    { term: 'Noun', definition: 'A word that names a person, place, thing, or idea', example: 'Dog, school, and happiness are nouns' },
    { term: 'Verb', definition: 'A word that shows action or state of being', example: 'Run, jump, and is are verbs' },
    { term: 'Adjective', definition: 'A word that describes a noun', example: 'Big, red, and happy are adjectives' },
    { term: 'Adverb', definition: 'A word that describes a verb, often ending in -ly', example: 'Quickly, slowly, and very are adverbs' },
    { term: 'Pronoun', definition: 'A word that replaces a noun', example: 'He, she, and they are pronouns' },
  ],
  suggestedQuestions: [
    'What is the noun in this sentence: "The cat sleeps"?',
    'Is "beautiful" a noun or an adjective?',
    'What pronoun could replace "Maria"?',
  ],
  flashcards: [
    { front: 'What part of speech names a person, place, or thing?', back: 'Noun', hint: 'Examples: cat, school, love' },
    { front: 'What part of speech shows action?', back: 'Verb', hint: 'Examples: run, jump, sing' },
    { front: 'What part of speech describes a noun?', back: 'Adjective', hint: 'Examples: big, red, happy' },
    { front: 'What part of speech often ends in -ly?', back: 'Adverb', hint: 'Examples: quickly, slowly' },
    { front: 'What word can replace "John" in a sentence?', back: 'He (pronoun)' },
  ],
  quiz: [
    {
      question: 'What part of speech is the word "quickly"?',
      options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
      correctIndex: 3,
      explanation: '"Quickly" is an adverb because it describes how something is done. Most adverbs end in -ly!',
    },
    {
      question: 'In the sentence "The tall tree grows," what is "tall"?',
      options: ['Noun', 'Verb', 'Adjective', 'Pronoun'],
      correctIndex: 2,
      explanation: '"Tall" is an adjective because it describes the noun "tree."',
    },
    {
      question: 'Which word is a verb?',
      options: ['Beautiful', 'School', 'Running', 'They'],
      correctIndex: 2,
      explanation: '"Running" is a verb because it shows an action!',
    },
    {
      question: 'What type of word is "she"?',
      options: ['Noun', 'Pronoun', 'Adjective', 'Verb'],
      correctIndex: 1,
      explanation: '"She" is a pronoun because it replaces a noun (like a person\'s name).',
    },
  ],
};

// ============================================================
// EXPORT ALL SAMPLE LESSONS
// ============================================================

export const SAMPLE_LESSONS: SampleLesson[] = [
  // Math
  mathYoung,
  mathOlder,
  // Science
  scienceYoung,
  scienceOlder,
  // English
  englishYoung,
  englishOlder,
];

/**
 * Get sample lessons filtered by age group
 */
export function getSampleLessonsByAgeGroup(ageGroup: 'YOUNG' | 'OLDER'): SampleLesson[] {
  return SAMPLE_LESSONS.filter(lesson => lesson.ageGroup === ageGroup);
}

/**
 * Get sample lessons filtered by subject
 */
export function getSampleLessonsBySubject(subject: 'MATH' | 'SCIENCE' | 'ENGLISH'): SampleLesson[] {
  return SAMPLE_LESSONS.filter(lesson => lesson.subject === subject);
}

/**
 * Get a single sample lesson by ID
 */
export function getSampleLessonById(id: string): SampleLesson | undefined {
  return SAMPLE_LESSONS.find(lesson => lesson.id === id);
}

/**
 * Determine age group based on child's age
 */
export function getAgeGroupFromAge(age: number): 'YOUNG' | 'OLDER' {
  return age <= 7 ? 'YOUNG' : 'OLDER';
}

export default SAMPLE_LESSONS;
