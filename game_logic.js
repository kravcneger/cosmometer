/**
 * author Ivan Kravtsov
 */

function Field(rows, columns) {
	var self = this;

	var cosmometer_x = Math.floor(columns / 2);
	this.cells = getArray();

	this.nextRow = function() {
		if (self.cells[rows - 1].some(function(e, i) {
			return e === true;
		})) {
			gameOver();
		}
		self.cells.reduce(function(previousStr, currentItem, i) {
			if (i != 0) {
				self.cells[i] = previousStr;
				return currentItem;
			}
			return previousStr;
		}, this.cells[0]);
		this.cells[0] = getMultiplicity(columns);
		buildcosmometer();
	};

	// Совершает смещение корабля на плоскости
	this.offsetcosmometer = function(direction) {
		if ((cosmometer_x + direction) < 1
				|| (cosmometer_x + direction) >= columns - 1) {
			return;
		}
		buildcosmometer(direction);
	};

	this.createRocket = function() {
		self.cells[rows - 2][cosmometer_x - 1] = 2;
		self.cells[rows - 2][cosmometer_x + 1] = 2;
	};

	this.createBlaster = function() {
		if (Cosmometer.countBlaster > 0) {
			self.cells[rows - 3][cosmometer_x] = 3;
			Cosmometer.countBlaster--;
		}
	};

	this.flight_Rockets = function() {
		self.cells.forEach(function(row, i) {
			row.forEach(function(cell, j) {
				if (cell === 2) {
					if (i != 0) {
						if (self.cells[i - 1][j] === true) {
							self.cells[i - 1][j] = false;
							Cosmometer.all_glasses++;
							Cosmometer.glasses++;
						} else {
							self.cells[i - 1][j] = 2;
						}
					}
					self.cells[i][j] = false;
				} else if (cell === 3) {
					for (var d = 0; d < i; d++) {
						if (self.cells[d][j] === true) {
							Cosmometer.all_glasses++;
							Cosmometer.glasses++;
						}
						self.cells[d][j] = 4;
					}
				} else if (cell === 4) {
					self.cells[i][j] = false;
				}
			});
		});
		if (Cosmometer.glasses > 40) {
			Cosmometer.countBlaster += 10;
			Cosmometer.glasses -= 40;
		}
	};

	this.countColumns = function() {
		return columns;
	};

	this.countRows = function() {
		return rows;
	};

	// Задаёт клетки на плоскоти корабля
	function buildcosmometer(direction) {
		if (typeof direction != "undefined") {
			clearcosmometer();
			cosmometer_x += direction;
		}
		check(cosmometer_x);

		self.cells[rows - 3][cosmometer_x] = 1;
		self.cells[rows - 2][cosmometer_x] = 1;
		self.cells[rows - 1][cosmometer_x] = 1;
		self.cells[rows - 1][cosmometer_x - 1] = 1;
		self.cells[rows - 1][cosmometer_x + 1] = 1;
	}

	// Проверяет игру
	function check(position) {
		if ([ self.cells[rows - 3][position], self.cells[rows - 2][position],
				self.cells[rows - 1][position - 1],
				self.cells[rows - 1][position + 1] ].some(function(e) {
			return e === true;
		})) {
			gameOver();
		}
	}

	// Удаляет старое положение корабля
	function clearcosmometer() {
		self.cells[rows - 3][cosmometer_x] = false;
		self.cells[rows - 2][cosmometer_x] = false;
		self.cells[rows - 1][cosmometer_x - 1] = false;
		self.cells[rows - 1][cosmometer_x] = false;
		self.cells[rows - 1][cosmometer_x + 1] = false;
	}

	// Генерирует двухмерный массив с пустыми клетками (false)
	function getArray() {
		var ar = [];

		for (var i = 0; i < rows; i++) {
			ar[i] = [];
			for (var j = 0; j < columns; j++) {
				ar[i][j] = false;
			}
		}
		return ar;
	}

	// Генерирует случайный ряд
	function getMultiplicity(length) {
		var ar = new Array(length);
		while (length > 0) {
			ar[length - 1] = !Math.floor(Math.random() + 0.6);
			length--;
		}
		return ar;
	}
};

var Cosmometer = {
	glasses : 0,
	all_glasses : 0,
	countBlaster : 0,
	clear: function(){
		this.glasses = 0;
		this.all_glasses = 0;
		this.countBlaster = 0;
	},
};

function Place(element, field, edge) {
	this.edge = edge;
	this.getContext = function() {
		return element.getContext("2d");
	};
}

function Drawing(place, context, field) {
	this.render = function() {
		field.cells.forEach(function(row, i, arr1) {
			row.forEach(function(node, j, arr2) {
				if (node === true) {
					renderCell(i, j);
				} else if (node === false) {
					clearCell(i, j);
				} else if (node === 1) {
					spaceship(i, j);
				} else if (node === 2) {
					shellCell(i, j);
				} else if (node == 4) {
					blasterCell(i, j);
				}
			});
		});
	};

	// Рисует закрашенную клетку
	function renderCell(row, column) {
		context.fillStyle = "rgb(119,136,153)";
		context.fillRect(column * place.edge + 1, row * place.edge + 1,
				place.edge - 2, place.edge - 2);
	}

	// Клетка коробля
	function spaceship(row, column) {
		context.fillStyle = "rgb(200,0,0)";
		context.fillRect(column * place.edge + 1, row * place.edge + 1,
				place.edge - 2, place.edge - 2);
	}
	// Клетка снаряда
	function shellCell(row, column) {
		clearCell(row, column);
		context.fillStyle = "rgb(220,220,220)";
		context.fillRect(column * place.edge + 3, row * place.edge + 3,
				place.edge - 6, place.edge - 6);
	}
	// Луч бластера
	function blasterCell(row, column) {
		clearCell(row, column);
		context.fillStyle = "rgb(255,248,220)";
		context.fillRect(column * place.edge + 3, row * place.edge + 3,
				place.edge - 6, place.edge - 6);
	}

	// Пустая клетка
	function clearCell(row, column) {
		context.fillStyle = "rgb(119,136,153)";
		context.fillRect(column * place.edge + 1, row * place.edge + 1,
				place.edge - 2, place.edge - 2);
		context.clearRect(column * place.edge + 2, row * place.edge + 2,
				place.edge - 4, place.edge - 4);
	}
}

function Game() {

}

Game.Timers = [];

Game.startGame = function(rows, columns, edge, speed) {
	if( rows < 5 || columns < 5 ){
		alert('число столбцов и строк не может быть меньше 5');
		return;
	}
	
	var field = new Field(rows, columns);
	var elem_canvas = document.getElementById("place");
	elem_canvas.setAttribute("height", edge * rows);
	elem_canvas.setAttribute("width", edge * columns);

	var place = new Place(elem_canvas, field, edge);
	var context = place.getContext();
	var drawing = new Drawing(place, context, field);

	var all_glasses = document.getElementById("glasses");
	var countBlaster = document.getElementById("countBlaster");
	Cosmometer.clear();
	
	Game.Timers.push(setInterval(function() {
		field.nextRow();
	}, speed * 100));
	Game.Timers.push(setInterval(function() {
		field.flight_Rockets();
		drawing.render();
		all_glasses.innerHTML = Cosmometer.all_glasses;
		countBlaster.innerHTML = Cosmometer.countBlaster;
	}, 20));

	document.onkeydown = function(e) {
		e = e || window.event;
		if (e.keyCode == '37') {
			field.offsetcosmometer(-1);
		} else if (e.keyCode == '39') {
			field.offsetcosmometer(1);
		} else if (e.keyCode == '17') {
			field.createRocket();
		} else if (e.keyCode == '32') {
			field.createBlaster();
		}
		return false;
	};

};

// Удаляет все таймеры
Game.stopGame = function() {
	for (var i = 0; i < Game.Timers.length; i++) {
		clearInterval(Game.Timers[i]);
	}
	document.onkeydown = null;
};

function gameOver() {
	Game.stopGame();
	alert('Game Over');
}
