test("Field", function() {
	var field = new Field(10, 10);
	field.nextRow();
	var first_row = field.cells[0];
	field.nextRow();
	field.nextRow();
		
	deepEqual(field.cells[2], first_row, 'Смещение элементов');
	notDeepEqual(field.cells[0], first_row, 'Первая строчка уже другая');
	
	deepEqual(new Field(3, 2).cells , [[false,false],[false,false],[false,false]] , 'Инициализация множества клеток');
});
