/*
	Script for deck of cards workout web app
*/


// translation key for unicode suit symbols
let suit_symbols = {
	"spades": "\u2660",
	"hearts": "\u2665",
	"diamonds": "\u2666",
	"clubs": "\u2663"
};

//
// Handles the deck, inputs, and app flow
//
let CardDeck = {

	cards_space: document.getElementById("cards-container"),
	cards_counter_space: document.getElementById("cards-count-container"),
	counter: 0,
	deck: deck_source,
	
	shuffle: function () {
		this.deck.sort(() => Math.random() - 0.5);
	},

	// add card to page
	displayCard: function () {
		let card_text = document.createElement("div");
		this.cards_space.innerHTML = ""; // clear space
		
		// track number of preceding jokers
		let joker_count = 0;

		// if card is joker, increment counter and add until
		// next non-joker or end of deck	
		while (this.deck[this.counter].value === "joker"
				&& this.counter < this.deck.length-1) {
			this.cards_space.innerHTML += this.deck[this.counter]["unicode"];
			this.counter += 1;
			joker_count += 1;
		}
		
		// add non-joker card
		this.cards_space.innerHTML += this.deck[this.counter]["unicode"];	
		// update score
		ScoringDisplay.addNewCards(this.deck[this.counter], joker_count);
	},

	// add counter to page
	displayCounter: function () {
		//let card_count = document.createElement("div");
		//card_count.appendChild(document.createTextNode((this.counter+1)+"/"+this.deck.length));
		//this.cards_counter_space.appendChild(card_count);
		this.cards_counter_space.innerHTML = (this.counter+1)+"/"+this.deck.length;
	},

	// Clear card and counter contents, replacing with next or previous
	changeDisplay: function () {
		// remove content if any exists 
		/*
		if (this.cards_space.firstChild) {
			this.cards_space.innerHTML = "";
			this.cards_counter_space.innerHTML
		}
		*/	
		this.displayCard();
		this.displayCounter();	
	},

	// increment counter and display card if not at end of deck
	nextCard: function () {
		if (this.counter < this.deck.length-1) {
			this.counter += 1;
			this.changeDisplay();
		}
	},

	// ensure no jokers at the end of the deck
	noJokersAtEnd: function () {
		for (let i = this.deck.length-1; this.deck[this.deck.length-1].value === "joker"; i--) {
			let temp = this.deck[this.deck.length-1];
			this.deck[this.deck.length-1] = this.deck[i-1];
			this.deck[i-1] = temp;
		}
	},

	// restart process by setting counter to 0, shuffling deck,
	// and redisplaying
	start: function () {
		ScoringDisplay.start();
		this.counter = 0;
		this.shuffle();
		this.noJokersAtEnd();
		this.changeDisplay();
	}
}

//
// Handles card value modification
//
// Potential Idea: make modifiable by user
//
let CardModifiers = {
	card_key: {
		2: 5,
		3: 5,
		4: 5,
		"J": 11,
		"Q": 12,
		"K": 13,
		"A": 14
	},
	
	// calculate points total using modifiers
	getPointTotal: function (card, joker_count) {
		// condition for cards below 5 and above 10	
		if (card.value in this.card_key) {
			return this.applyJokers(this.card_key[card.value], joker_count, card.value < 5);
		}
		// standard condition
		return this.applyJokers(card.value, joker_count);
	},

	// apply doubling function based on joker count
	applyJokers: function (value, joker_count, double_joker_val) {
		let multiplier = 2;

		if (joker_count > 0) {
			if (double_joker_val) {
				multiplier *= 2;	
			}
			
			return value * (multiplier ** joker_count);
		}
		return value;
	}
}

//
// Tracks and updates cumulative count of each value
//
let ScoringDisplay = {
	score_disp: document.getElementById("score-container"),
	curr_val_disp: document.getElementById("current-cards-total-container"),
	points: {
		spades: 0,
		diamonds: 0,
		clubs: 0,
		hearts: 0,
		jokers: 0
	},
	
	// add new cards to scoring total and display total 	
	addNewCards: function (card, joker_count) {
		points = CardModifiers.getPointTotal(card, joker_count);
		this.points[card.suit] += points;
		this.points["jokers"] += joker_count;
		this.showCurrentValue(points, card["suit"]);
		this.displayScore();
	},

	// show the current total card value
	showCurrentValue: function (points, suit) {
		this.curr_val_disp.innerHTML = points+suit_symbols[suit];
	},

	// update score totals
	displayScore: function () {
		// remove content if any exists 
		if (this.score_disp.firstChild) {
			this.score_disp.innerHTML = "";
		}
		
		this.score_disp.innerHTML = 
			"<div>"+suit_symbols["spades"]+" "+this.points["spades"]+"</div>"+
			"<div>"+suit_symbols["clubs"]+" "+this.points["clubs"]+"</div>"+
			"<div>"+suit_symbols["hearts"]+" "+this.points["hearts"]+"</div>"+
			"<div>"+suit_symbols["diamonds"]+" "+this.points["diamonds"]+"</div>"+
			"<div>🃏"+this.points["jokers"]+"</div>"
	},

	start: function () {
		this.points.spades = 0;
		this.points.diamonds = 0;
		this.points.clubs = 0;
		this.points.hearts = 0;
		this.points.jokers = 0;
		this.displayScore();
	}
}

CardDeck.start();

document.getElementById("next-button").addEventListener("click", ()=> { CardDeck.nextCard(); });
document.getElementById("restart-button").addEventListener("click", ()=> { CardDeck.start(); });

