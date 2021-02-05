(function() {
    'use strict';
    var WordFind = function() {
        var letters = 'abcdefghijklmnoprstuvwy';
        var allOrientations = ['horizontal', 'horizontalBack', 'vertical', 'verticalUp', 'diagonal', 'diagonalUp', 'diagonalBack', 'diagonalUpBack'];
		var orientations = {
			horizontal:     function(x,y,i) { return {x: x+i, y: y  }; },
			horizontalBack: function(x,y,i) { return {x: x-i, y: y  }; },
			vertical:       function(x,y,i) { return {x: x,   y: y+i}; },
			verticalUp:     function(x,y,i) { return {x: x,   y: y-i}; },
			diagonal:       function(x,y,i) { return {x: x+i, y: y+i}; },
			diagonalBack:   function(x,y,i) { return {x: x-i, y: y+i}; },
			diagonalUp:     function(x,y,i) { return {x: x+i, y: y-i}; },
			diagonalUpBack: function(x,y,i) { return {x: x-i, y: y-i}; }
			};
		var checkOrientations = {
			horizontal:     function(x,y,h,w,l) { return w >= x + l; },
			horizontalBack: function(x,y,h,w,l) { return x + 1 >= l; },
			vertical:       function(x,y,h,w,l) { return h >= y + l; },
			verticalUp:     function(x,y,h,w,l) { return y + 1 >= l; },
			diagonal:       function(x,y,h,w,l) { return (w >= x + l) && (h >= y + l); },
			diagonalBack:   function(x,y,h,w,l) { return (x + 1 >= l) && (h >= y + l); },
			diagonalUp:     function(x,y,h,w,l) { return (w >= x + l) && (y + 1 >= l); },
			diagonalUpBack: function(x,y,h,w,l) { return (x + 1 >= l) && (y + 1 >= l); }
		};
		var skipOrientations = {
			horizontal:     function(x,y,l) { return {x: 0,   y: y+1  }; },
			horizontalBack: function(x,y,l) { return {x: l-1, y: y    }; },
			vertical:       function(x,y,l) { return {x: 0,   y: y+100}; },
			verticalUp:     function(x,y,l) { return {x: 0,   y: l-1  }; },
			diagonal:       function(x,y,l) { return {x: 0,   y: y+1  }; },
			diagonalBack:   function(x,y,l) { return {x: l-1, y: x>=l-1?y+1:y    }; },
			diagonalUp:     function(x,y,l) { return {x: 0,   y: y<l-1?l-1:y+1  }; },
			diagonalUpBack: function(x,y,l) { return {x: l-1, y: x>=l-1?y+1:y  }; }
		};
        var fillPuzzle = function(words, options) {
            var puzzle = [],
                i, j, len;
            for (i = 0; i < options.height; i++) {
                puzzle.push([]);
                for (j = 0; j < options.width; j++) {
                    puzzle[i].push('');
                }
            }
            for (i = 0, len = words.length; i < len; i++) {
                if (!placeWordInPuzzle(puzzle, options, words[i])) {
                    return null;
                }
            }
            return puzzle;
        };
        var placeWordInPuzzle = function(puzzle, options, word) {
            var locations = findBestLocations(puzzle, options, word);
            if (locations.length === 0) {
                return false;
            }
            var sel = locations[Math.floor(Math.random() * locations.length)];
            placeWord(puzzle, word, sel.x, sel.y, orientations[sel.orientation]);
            return true;
        };
        var findBestLocations = function(puzzle, options, word) {
            var locations = [],
                height = options.height,
                width = options.width,
                wordLength = word.length,
                maxOverlap = 0;
            for (var k = 0, len = options.orientations.length; k < len; k++) {
                var orientation = options.orientations[k],
                    check = checkOrientations[orientation],
                    next = orientations[orientation],
                    skipTo = skipOrientations[orientation],
                    x = 0,
                    y = 0;
                while (y < height) {
                    if (check(x, y, height, width, wordLength)) {
                        var overlap = calcOverlap(word, puzzle, x, y, next);
                        if (overlap >= maxOverlap || (!options.preferOverlap && overlap > -1)) {
                            maxOverlap = overlap;
                            locations.push({
                                x: x,
                                y: y,
                                orientation: orientation,
                                overlap: overlap
                            });
                        }
                        x++;
                        if (x >= width) {
                            x = 0;
                            y++;
                        }
                    } else {
                        var nextPossible = skipTo(x, y, wordLength);
                        x = nextPossible.x;
                        y = nextPossible.y;
                    }
                }
            }
            return options.preferOverlap ? pruneLocations(locations, maxOverlap) : locations;
        };
        var calcOverlap = function(word, puzzle, x, y, fnGetSquare) {
            var overlap = 0;
            for (var i = 0, len = word.length; i < len; i++) {
                var next = fnGetSquare(x, y, i),
                    square = puzzle[next.y][next.x];
                if (square === word[i]) {
                    overlap++;
                } else if (square !== '') {
                    return -1;
                }
            }
            return overlap;
        };
        var pruneLocations = function(locations, overlap) {
            var pruned = [];
            for (var i = 0, len = locations.length; i < len; i++) {
                if (locations[i].overlap >= overlap) {
                    pruned.push(locations[i]);
                }
            }
            return pruned;
        };
        var placeWord = function(puzzle, word, x, y, fnGetSquare) {
            for (var i = 0, len = word.length; i < len; i++) {
                var next = fnGetSquare(x, y, i);
                puzzle[next.y][next.x] = word[i];
            }
        };
        return {
            validOrientations: allOrientations,
            orientations: orientations,
            newPuzzle: function(words, settings) {
                var wordList, puzzle, attempts = 0,
                    opts = settings || {};
                wordList = words.slice(0).sort(function(a, b) {
                    return (a.length < b.length) ? 1 : 0;
                });
                var options = {
                    height: opts.height || wordList[0].length,
                    width: opts.width || wordList[0].length,
                    orientations: opts.orientations || allOrientations,
                    fillBlanks: opts.fillBlanks !== undefined ? opts.fillBlanks : true,
                    maxAttempts: opts.maxAttempts || 3,
                    preferOverlap: opts.preferOverlap !== undefined ? opts.preferOverlap : true
                };
                while (!puzzle) {
                    while (!puzzle && attempts++ < options.maxAttempts) {
                        puzzle = fillPuzzle(wordList, options);
                    }
                    if (!puzzle) {
                        options.height++;
                        options.width++;
                        attempts = 0;
                    }
                }
                if (options.fillBlanks) {
                    this.fillBlanks(puzzle, options);
                }
                return puzzle;
            },
            fillBlanks: function(puzzle) {
                for (var i = 0, height = puzzle.length; i < height; i++) {
                    var row = puzzle[i];
                    for (var j = 0, width = row.length; j < width; j++) {
                        if (!puzzle[i][j]) {
                            var randomLetter = Math.floor(Math.random() * letters.length);
                            puzzle[i][j] = letters[randomLetter];
                        }
                    }
                }
            },
            solve: function(puzzle, words) {
                var options = {
                        height: puzzle.length,
                        width: puzzle[0].length,
                        orientations: allOrientations,
                        preferOverlap: true
                    },
                    found = [],
                    notFound = [];
                for (var i = 0, len = words.length; i < len; i++) {
                    var word = words[i],
                        locations = findBestLocations(puzzle, options, word);
                    if (locations.length > 0 && locations[0].overlap === word.length) {
                        locations[0].word = word;
                        found.push(locations[0]);
                    } else {
                        notFound.push(word);
                    }
                }
                return {
                    found: found,
                    notFound: notFound
                };
            },
            print: function(puzzle) {
                var puzzleString = '';
                for (var i = 0, height = puzzle.length; i < height; i++) {
                    var row = puzzle[i];
                    for (var j = 0, width = row.length; j < width; j++) {
                        puzzleString += (row[j] === '' ? ' ' : row[j]) + ' ';
                    }
                    puzzleString += '\n';
                }
                return puzzleString;
            }
        };
    };
    var root = typeof exports !== "undefined" && exports !== null ? exports : window;
    root.wordfind = WordFind();
}).call(this);

(function(document, $, wordfind) {
    'use strict';
    var WordFindGame = function() {
        var wordList;
		var wordhandler;
        var drawPuzzle = function(el, puzzle) {
            var output = '';
            for (var i = 0, height = puzzle.length; i < height; i++) {
                var row = puzzle[i];
                output += '<div class="clearfix">';
                for (var j = 0, width = row.length; j < width; j++) {
                    output += '<div class="puzzleSquare" x="' + j + '" y="' + i + '">';
                    output += row[j] || ' ';
                    output += '</div>';
                }
                output += '</div>';
            }
            $(el).html(output);
        };
        var drawWords = function(el, words) {
            var output = '<ul>';
            for (var i = 0, len = words.length; i < len; i++) {
                var word = words[i];
                output += '<li class="word ' + word + '">' + word;
            }
            output += '</ul>';
            $(el).html(output);
        };
        var startSquare, selectedSquares = [],
            curOrientation, curWord = '';
        var startTurn = function() {
            $(this).addClass('selected');
            startSquare = this;
            selectedSquares.push(this);
            curWord = $(this).text();
        };
        var select = function(target) {
            if (!startSquare) {
                return;
            }
            var lastSquare = selectedSquares[selectedSquares.length - 1];
            if (lastSquare == target) {
                return;
            }
            var backTo;
            for (var i = 0, len = selectedSquares.length; i < len; i++) {
                if (selectedSquares[i] == target) {
                    backTo = i + 1;
                    break;
                }
            }
            while (backTo < selectedSquares.length) {
                $(selectedSquares[selectedSquares.length - 1]).removeClass('selected');
                selectedSquares.splice(backTo, 1);
                curWord = curWord.substr(0, curWord.length - 1);
            }
            var newOrientation = calcOrientation($(startSquare).attr('x') - 0, $(startSquare).attr('y') - 0, $(target).attr('x') - 0, $(target).attr('y') - 0);
            if (newOrientation) {
                selectedSquares = [startSquare];
                curWord = $(startSquare).text();
                if (lastSquare !== startSquare) {
                    $(lastSquare).removeClass('selected');
                    lastSquare = startSquare;
                }
                curOrientation = newOrientation;
            }
            var orientation = calcOrientation($(lastSquare).attr('x') - 0, $(lastSquare).attr('y') - 0, $(target).attr('x') - 0, $(target).attr('y') - 0);
            if (!orientation) {
                return;
            }
            if (!curOrientation || curOrientation === orientation) {
                curOrientation = orientation;
                playTurn(target);
            }
        };
        var touchMove = function(e) {
            var xPos = e.originalEvent.touches[0].pageX;
            var yPos = e.originalEvent.touches[0].pageY;
            var targetElement = document.elementFromPoint(xPos, yPos);
            select(targetElement)
        };
        var mouseMove = function() {
            select(this);
        };
        var playTurn = function(square) {
            for (var i = 0, len = wordList.length; i < len; i++) {
                if (wordList[i].indexOf(curWord + $(square).text()) === 0) {
                    $(square).addClass('selected');
                    selectedSquares.push(square);
                    curWord += $(square).text();
                    break;
                }
            }
        };
        var endTurn = function() {
            for (var i = 0, len = wordList.length; i < len; i++) {
                if (wordList[i] === curWord) {
                    $('.selected').addClass('found');
                    wordList.splice(i, 1);
                    $('.' + curWord).addClass('wordFound');
					iWords.push(curWord);
					update_puzzle();
                }
                if (wordList.length === 0) {
                    $('.puzzleSquare').addClass('complete');
					endgame();
                }
            }
            $('.selected').removeClass('selected');
            startSquare = null;
            selectedSquares = [];
            curWord = '';
            curOrientation = null;
        };
        var calcOrientation = function(x1, y1, x2, y2) {
            for (var orientation in wordfind.orientations) {
                var nextFn = wordfind.orientations[orientation];
                var nextPos = nextFn(x1, y1, 1);
                if (nextPos.x === x2 && nextPos.y === y2) {
                    return orientation;
                }
            }
            return null;
        };
        return {
            create: function(words, puzzleEl, wordsEl, options) {
                wordList = words.slice(0).sort();
                var puzzle = wordfind.newPuzzle(words, options);
                drawPuzzle(puzzleEl, puzzle);
				//drawWords(wordsEl, wordList);
                $('.puzzleSquare').on("mousedown", startTurn);
                $('.puzzleSquare').on("mouseenter", mouseMove);
                $('.puzzleSquare').on("mouseup", endTurn);
                $('.puzzleSquare').on("touchstart", startTurn);
                $('.puzzleSquare').on("touchmove", touchMove);
                $('.puzzleSquare').on("touchend", endTurn);
                return puzzle;
            },
            solve: function(puzzle, words) {
                var solution = wordfind.solve(puzzle, words).found;
                for (var i = 0, len = solution.length; i < len; i++) {
                    var word = solution[i].word,
                        orientation = solution[i].orientation,
                        x = solution[i].x,
                        y = solution[i].y,
                        next = wordfind.orientations[orientation];
                    if (!$('.' + word).hasClass('wordFound')) {
                        for (var j = 0, size = word.length; j < size; j++) {
                            var nextPos = next(x, y, j);
                            $('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').addClass('solved');
                        }
                        $('.' + word).addClass('wordFound');
                    }
                }
            },
        };
    };
    window.wordfindgame = WordFindGame();
}(document, jQuery, wordfind));