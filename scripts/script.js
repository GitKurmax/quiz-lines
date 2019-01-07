quiz();

function quiz(){
	let resultArray = [];
	let images = [
		{
				image1:"img/1.jpg",
				image2:"img/3.jpg"
			},
		{
				image1:"img/2.jpg",
				image2:"img/5.jpg"
			},
		{
				image1:"img/4.jpg",
				image2:"img/7.jpg"
			},
		{
				image1:"img/6.jpg",
				image2:"img/10.jpg"
			},
		{
				image1:"img/8.jpg",
				image2:"img/9.jpg"
			}
		];
	let button = document.querySelector('#check');
	let topImages = [];
	let bottomImages = [];

	for(var i=0; i < images.length; i++){
		topImages.push(images[i].image1);
		bottomImages.push(images[i].image2);
	}
	
	let objects = {
			color: ['#FF40AC','#40FFFF','#FFDE40','#BB40FF','#D0FF73','#FFBF40','#7A40FF','#FF9F40',],
			border: ['dotted','solid','dashed','double'],
			borderWidth: [2,7,4,6,3]
	}
	let topBlock = document.querySelector('.top');
	let imagesTop = topBlock.getElementsByTagName('img');
	let bottomBlock = document.querySelector('.bottom');
	let imagesBottom = bottomBlock.getElementsByTagName('img');
	let coupleCounter = 0;
	let borderCounter = 0;
	let borderWidthCounter = 0;
	let colorCounter = 0;

	placeImagesRandom(topBlock, topImages);
	placeImagesRandom(bottomBlock, bottomImages);

	for (let i = 0; i < imagesTop.length; i++) {
		imagesTop[i].addEventListener('click', click);
		imagesBottom[i].addEventListener('click', click2);
	}

	check();

	function click(){
			let self = this;
			select(self, imagesTop, click, click2);
		}

		function click2(){
			let self = this;
			select(self, imagesBottom, click, click2);
		}

	function select(context, elems, func1, func2) {
		context.style.cssText = "border:" + objects.borderWidth[borderWidthCounter] + "px " + objects.border[borderCounter] + objects.color[colorCounter];
		context.classList.add('couple');
		let hasClass = checkClass();
		if(hasClass){
			drawLine(func1, func2);
		}
				
			for (let i = 0; i < elems.length; i++) {
				if(elems[i] == context){
					continue;
				}
				if(context.classList.contains('couple')&&elems[i].classList.contains('couple')){
						context.style.cssText = "border:" + objects.borderWidth[borderWidthCounter] + "px " + objects.border[borderCounter] + objects.color[colorCounter];
						elems[i].style.cssText = "";
						elems[i].classList.toggle('couple');
					}
				}
			}

		function drawLine(func1, func2){//отрисовка линии
			let svg = document.getElementById('lines');
			let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			let couple = document.querySelectorAll('.couple');
			let coord = couple[0].getBoundingClientRect();
			let coord2 = couple[1].getBoundingClientRect();
			let svgCoord = svg.getBoundingClientRect();
			
			couple[0].style.cssText = "border:" + objects.borderWidth[borderWidthCounter] + "px " + objects.border[borderCounter] + objects.color[colorCounter];
			couple[1].style.cssText = "border:" + objects.borderWidth[borderWidthCounter] + "px " + objects.border[borderCounter] + objects.color[colorCounter];
			
			let x1 = coord.left + (coord.right - coord.left)/2 - svgCoord.left;
			let x2 = coord2.left + (coord2.right - coord2.left)/2 - svgCoord.left;
			let y1 = 0;
			let y2 = coord2.top - coord.bottom;

			line.setAttributeNS(null,"x1", x1);
			line.setAttributeNS(null,"y1", y1);
			line.setAttributeNS(null,"x2", x2);
			line.setAttributeNS(null,"y2", y2);
			line.style.cssText = "stroke:" + objects.color[colorCounter] + ";stroke-linecap: round; stroke-width: " + objects.borderWidth[borderCounter] + "px";
			
			let elemColor = "stroke:" + objects.color[colorCounter];
			
			svg.appendChild(line);
			couple[0].classList.toggle('couple');
			couple[1].classList.toggle('couple');
			couple[0].classList.add('pair' + coupleCounter);
			couple[1].classList.add('pair' + coupleCounter);
			line.classList.add('pair' + coupleCounter);
			couple[0].removeEventListener('click', func1);
			couple[1].removeEventListener('click', func2);
			
			let y = 20;
			let x = getCoordsOfDelBlock(x1,x2,y1,y2,y);
			let delBlock = delLineElement(coord, couple, x, y, objects.color[colorCounter], svgCoord);

			delBlock.classList.add('pair' + coupleCounter);
			resultArray.push({pair: 'pair' + coupleCounter, image1: couple[0], image2: couple[1], line: line, delBlock: delBlock});

			delBlock.addEventListener('click', function(){
				for (var i = 0; i < resultArray.length; i++) {
					if(this.classList == resultArray[i].pair){
						this.parentNode.removeChild(this);
						svg.removeChild(resultArray[i].line);
						resultArray[i].image1.style.cssText = "";
						resultArray[i].image1.classList.toggle(this.classList);
						resultArray[i].image2.style.cssText = "";
						resultArray[i].image2.classList.toggle(this.classList);
						resultArray[i].image1.addEventListener('click', click);
						resultArray[i].image2.addEventListener('click', click2);
						resultArray.splice(i, 1);
						coupleCounter = resultArray.length;
						}
					if(coupleCounter < images.length){
						button.disabled = true;
						button.classList.toggle("active");
					}
				}
				recountPairs(resultArray);
			});

			if(coupleCounter == images.length - 1){
				button.disabled = false;
				button.classList.toggle("active");
			}
			coupleCounter = resultArray.length;
			colorCounter = counterReset(colorCounter,objects.color.length);
			borderCounter = counterReset(borderCounter,objects.border.length);
			borderWidthCounter = counterReset(borderWidthCounter,objects.borderWidth.length);
		}

		function counterReset(counter, objectsLength){
			counter++;
			if(counter == objectsLength){
				counter = 0;
			}
				return counter;
		}

		function checkClass(){
			for (var i = 0; i < imagesTop.length; i++) {
				if(imagesTop[i].classList.contains('couple')){
					var first = true;
				}
				if(imagesBottom[i].classList.contains('couple')){
					var second = true;
				}
			}
			return first + second;
		}

		function delLineElement(coord, couple, x, y, color, svgCoord){ // блок для удаления линии
			let delLine = document.createElement('div');

			delLine.innerHTML = '&#9587';
			delLine.style.cssText = "position: absolute; width: 20px;height: 20px;line-height: 20px;padding: 5px;font-size:15px;text-align: center;border-radius: 100%;background-color: white;cursor: pointer; color:" + color;
			let wrap = document.querySelector("#svgWrapper");

			wrap.appendChild(delLine);
			delLine.style.top = y - delLine.offsetHeight/2 +pageYOffset + "px";
			delLine.style.left = coord.left + couple[0].offsetWidth/2 - delLine.offsetWidth/2 + x + pageXOffset - svgCoord.left + "px";
			
			return delLine;
		}

		function getCoordsOfDelBlock(x1,x2,y1,y2,y){
			let tang;
			let x; 
			if(x1 == x2){
				x = 0;
			}else{
				tang = (y2 - y1)/(x2 - x1);
				x = y/tang; 
			}
			return x;
		}

		function placeImagesRandom(parent, imgArray){
			while(imgArray.length > 0){
				let i = Math.round(Math.random()*(imgArray.length - 1));
				var img = document.createElement('img');
				img.src = imgArray[i];
				parent.appendChild(img);
				imgArray.splice(i,1);
			}
		}

		function recountPairs(array){
			for (var i = 0; i < array.length; i++) {
				var pairClass = "pair" + i;
				array[i].pair = pairClass;
				array[i].image1.classList = pairClass;
				array[i].image2.classList = pairClass;
				array[i].line.classList = pairClass;
				array[i].delBlock.classList = pairClass;
			}
		}

		function check(){
			button.addEventListener('click', function (){
				for (var i = 0; i < images.length; i++) {
					for (var j = 0; j < resultArray.length; j++) {
						if(resultArray[j].image1.src.indexOf(images[i].image1) + 1&&resultArray[j].image2.src.indexOf(images[i].image2) + 1){
							resultArray[j].trigger = true;
						}
					}
				}
				
				for (var i = 0; i < resultArray.length; i++) {
					resultArray[i].delBlock.hidden = true;
					if(resultArray[i].trigger){
						let style = "border: 7px solid green";
						resultArray[i].image1.style.cssText = style;
						resultArray[i].image2.style.cssText = style;
						resultArray[i].line.style.stroke = "green";
					}else{
						let style = "border: 7px solid red";
						resultArray[i].image1.style.cssText = style;
						resultArray[i].image2.style.cssText = style;
						resultArray[i].line.style.stroke = "red";
					}
				}
				button.disabled = true;
			});
		}
	}