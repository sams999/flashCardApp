document.addEventListener('DOMContentLoaded', function() {
    const flashcardsContainer = document.getElementById('flashcards');
    const addCardButton = document.getElementById('addCard');
    const checkScoreButton = document.getElementById('checkScore');
    const resetScoreButton = document.getElementById('resetScore');
    const deleteAllButton = document.getElementById('deleteAll');
    const resetAllButton = document.getElementById('resetAll');
    const scoreElement = document.createElement('div');
    let cardCounter = 1;
    let correctCount = 0;
    let totalCount = 0;

    function saveFlashcardsToLocalStorage() {
        const flashcardsData = {
            cardCounter: cardCounter,
            correctCount: correctCount,
            totalCount: totalCount,
            flashcards: []
        };

        flashcardsContainer.querySelectorAll('.flashcard').forEach(function(flashcard) {
            const question = flashcard.querySelector('.question').innerText;
            const answer = flashcard.querySelector('.answer').innerText;
            flashcardsData.flashcards.push({ question, answer });
        });

        localStorage.setItem('flashcardsData', JSON.stringify(flashcardsData));
    }

    function loadFlashcardsFromLocalStorage() {
        const flashcardsData = JSON.parse(localStorage.getItem('flashcardsData'));

        if (flashcardsData) {
            cardCounter = flashcardsData.cardCounter;
            correctCount = flashcardsData.correctCount;
            totalCount = flashcardsData.totalCount;

            if (flashcardsData.flashcards) {
                flashcardsData.flashcards.forEach(function(flashcardData) {
                    createFlashcard(flashcardData.question, flashcardData.answer);
                });
            }
        } else {
            cardCounter = 1;
        }

        updateButtonVisibility(); // Call this after loading from localStorage
    }

    function createFlashcard(question, answer) {
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');
        flashcard.innerHTML = `
            <div class="card-number">${cardCounter}</div>
            <div class="delete-card">×</div>
            <div class="question">${question}</div>
            <div class="answer" style="display:none;">${answer}</div>
            <textarea class="userAnswer" rows="3" cols="30" placeholder="Type your answer here"></textarea>
            <button class="checkAnswer">Submit Answer</button>
            <button class="revealAnswer" style="display:none;">Reveal Answer</button>
            <div class="result" style="display:none;"></div>
            <button class="resetCard" style="display:none;">Reset Card</button>
        `;

        const checkAnswerButton = flashcard.querySelector('.checkAnswer');
        const revealAnswerButton = flashcard.querySelector('.revealAnswer');
        const resetCardButton = flashcard.querySelector('.resetCard');
        const answerElement = flashcard.querySelector('.answer');
        const resultElement = flashcard.querySelector('.result');

        const deleteCardButton = flashcard.querySelector('.delete-card');
        deleteCardButton.addEventListener('click', function() {
            flashcard.remove();
            updateCardNumbers();
            saveFlashcardsToLocalStorage();
            updateButtonVisibility(); // Call this after deleting a flashcard
        });

        checkAnswerButton.addEventListener('click', function() {
            const userAnswer = flashcard.querySelector('.userAnswer').value;
            if (userAnswer.trim().toLowerCase() === answer.toLowerCase()) {
                answerElement.style.display = 'block';
                answerElement.classList.add('correct');
                resultElement.innerHTML = '&#10004; Correct! \u{1F9D1}\u{1F3FD}\u{200D}\u{1F680}' + ' \u{1F680} \u{2B50}';
                resultElement.classList.add('correct');
                resultElement.style.color = 'green';
                resultElement.style.display = 'block';
                resetCardButton.style.display = 'inline-block';
                correctCount++;
                animateCorrectEmoji();
            } else {
                answerElement.style.display = 'none';
                revealAnswerButton.style.display = 'inline-block';
                resultElement.innerHTML = '&#10060; Sorry! Try again. \u{1F63E}';
                resultElement.classList.add('incorrect');
                resultElement.style.color = 'red';
                resultElement.style.display = 'block';
                resetCardButton.style.display = 'inline-block';
                animateIncorrectEmoji();
            }
            totalCount++;
            saveFlashcardsToLocalStorage();
            updateButtonVisibility(); // Call this after checking the answer
        });

        revealAnswerButton.addEventListener('click', function() {
            answerElement.style.display = 'block';
            answerElement.classList.add('incorrect');
            resultElement.style.display = 'none';
            revealAnswerButton.style.display = 'none';
        });

        resetCardButton.addEventListener('click', function() {
            flashcard.querySelector('.userAnswer').value = '';
            answerElement.style.display = 'none';
            answerElement.classList.remove('correct', 'incorrect');
            resultElement.style.display = 'none';
            resultElement.classList.remove('correct', 'incorrect');
            revealAnswerButton.style.display = 'none';
            resetCardButton.style.display = 'none';
            saveFlashcardsToLocalStorage();
        });

        flashcardsContainer.appendChild(flashcard);
        cardCounter++;
        updateCardNumbers();
        saveFlashcardsToLocalStorage();
        updateButtonVisibility(); // Call this after creating a flashcard
    }

    function deleteAllFlashcards() {
        flashcardsContainer.innerHTML = '';
        cardCounter = 1;
        saveFlashcardsToLocalStorage();
        updateButtonVisibility(); // Call this after deleting all flashcards
    }

    function updateCardNumbers() {
        const flashcards = flashcardsContainer.querySelectorAll('.flashcard');
        flashcards.forEach(function(flashcard, index) {
            const cardNumberElement = flashcard.querySelector('.card-number');
            cardNumberElement.textContent = index + 1;
        });
    }

    function updateScore() {
        scoreElement.innerHTML = `Correct: ${correctCount} / Total: ${totalCount}`;
    }

    function animateCorrectEmoji() {
        const catEmojiContainer = document.createElement('div');
        catEmojiContainer.style.display = 'flex';
        catEmojiContainer.style.alignItems = 'center';
        catEmojiContainer.style.justifyContent = 'center';
        catEmojiContainer.style.position = 'fixed';
        catEmojiContainer.style.top = '50%';
        catEmojiContainer.style.left = '50%';
        catEmojiContainer.style.transform = 'translate(-50%, -50%)';
        catEmojiContainer.style.width = '50vw'; // Takes up 50% of the viewport width
        catEmojiContainer.style.opacity = '0.7'; // Make it slightly transparent

        const catEmoji = document.createElement('div');
        catEmoji.innerHTML = '&#x1F63A;'; // Smiling Cat emoji
        catEmoji.style.fontSize = '50vmin'; // Takes up 50% of the viewport width

        catEmojiContainer.appendChild(catEmoji);

        document.body.appendChild(catEmojiContainer);

        setTimeout(function() {
            catEmojiContainer.remove();

            const thumbsUpContainer = document.createElement('div');
            thumbsUpContainer.style.display = 'flex';
            thumbsUpContainer.style.alignItems = 'center';
            thumbsUpContainer.style.justifyContent = 'center';
            thumbsUpContainer.style.position = 'fixed';
            thumbsUpContainer.style.top = '50%';
            thumbsUpContainer.style.left = '50%';
            thumbsUpContainer.style.transform = 'translate(-50%, -50%)';
            thumbsUpContainer.style.width = '50vw'; // Takes up 50% of the viewport width
            thumbsUpContainer.style.opacity = '0.7'; // Make it slightly transparent

            const thumbsUp = document.createElement('span');
            thumbsUp.innerHTML = '&#128077;'; // Thumbs up emoji
            thumbsUp.style.fontSize = '50vmin'; // Takes up 50% of the viewport width

            thumbsUpContainer.appendChild(thumbsUp);

            document.body.appendChild(thumbsUpContainer);

            setTimeout(function() {
                thumbsUpContainer.remove();
            }, 500);
        }, 500);
    }

    function animateIncorrectEmoji() {
        const poopEmojiContainer = document.createElement('div');
        poopEmojiContainer.style.display = 'flex';
        poopEmojiContainer.style.alignItems = 'center';
        poopEmojiContainer.style.justifyContent = 'center';
        poopEmojiContainer.style.position = 'fixed';
        poopEmojiContainer.style.top = '50%';
        poopEmojiContainer.style.left = '50%';
        poopEmojiContainer.style.transform = 'translate(-50%, -50%)';
        poopEmojiContainer.style.width = '50vw'; // Takes up 50% of the viewport width
        poopEmojiContainer.style.opacity = '0.7'; // Make it slightly transparent

        const poopEmoji = document.createElement('div');
        poopEmoji.innerHTML = '&#x1F4A9;'; // Poop emoji
        poopEmoji.style.fontSize = '50vmin'; // Takes up 50% of the viewport width

        poopEmojiContainer.appendChild(poopEmoji);

        document.body.appendChild(poopEmojiContainer);

        setTimeout(function() {
            poopEmojiContainer.remove();

            const thumbsDownContainer = document.createElement('div');
            thumbsDownContainer.style.display = 'flex';
            thumbsDownContainer.style.alignItems = 'center';
            thumbsDownContainer.style.justifyContent = 'center';
            thumbsDownContainer.style.position = 'fixed';
            thumbsDownContainer.style.top = '50%';
            thumbsDownContainer.style.left = '50%';
            thumbsDownContainer.style.transform = 'translate(-50%, -50%)';
            thumbsDownContainer.style.width = '50vw'; // Takes up 50% of the viewport width
            thumbsDownContainer.style.opacity = '0.7'; // Make it slightly transparent

            const thumbsDown = document.createElement('span');
            thumbsDown.innerHTML = '&#128078;'; // Thumbs down emoji
            thumbsDown.style.fontSize = '50vmin'; // Takes up 50% of the viewport width

            thumbsDownContainer.appendChild(thumbsDown);

            document.body.appendChild(thumbsDownContainer);

            setTimeout(function() {
                thumbsDownContainer.remove();
            }, 500);
        }, 500);
    }

    function updateButtonVisibility() {
        const flashcards = flashcardsContainer.querySelectorAll('.flashcard');
        const checkScoreButton = document.getElementById('checkScore');
        const resetScoreButton = document.getElementById('resetScore');
        const deleteAllButton = document.getElementById('deleteAll');
        const resetAllButton = document.getElementById('resetAll');

        if (flashcards.length > 0) {
            checkScoreButton.style.display = 'inline-block';
            resetScoreButton.style.display = 'inline-block';
            deleteAllButton.style.display = 'inline-block';
            resetAllButton.style.display = 'inline-block';
        } else {
            checkScoreButton.style.display = 'none';
            resetScoreButton.style.display = 'none';
            deleteAllButton.style.display = 'none';
            resetAllButton.style.display = 'none';
        }
    }

    addCardButton.addEventListener('click', function() {
        const question = prompt('Enter a new question:');
        const answer = prompt('Enter your new answer:');
        if (question && answer) {
            createFlashcard(question, answer);
        }
    });

    deleteAllButton.addEventListener('click', function() {
        if (confirm('Delete all flashcards?')) {
            deleteAllFlashcards();
            correctCount = 0; // Reset correct count
            totalCount = 0;   // Reset total count
            updateScore();
            saveFlashcardsToLocalStorage();
        }
    });
    
    checkScoreButton.addEventListener('click', function() {
        if (totalCount > 0) {
            const percentage = ((correctCount / totalCount) * 100).toFixed(2);
            alert(`You got ${correctCount} out of ${totalCount} correct, ${percentage}%`);
        } else {
            alert('You haven\'t answered any questions yet.');
        }
    });
    
    resetScoreButton.addEventListener('click', function() {
        correctCount = 0;
        totalCount = 0;
        updateScore();
        saveFlashcardsToLocalStorage();
    });

    resetAllButton.addEventListener('click', function() {
        correctCount = 0;
        totalCount = 0;
        updateScore();
        saveFlashcardsToLocalStorage();
        location.reload();
    });

    loadFlashcardsFromLocalStorage();
});
