/*
Terminal emulator
last modified:  2022-10-14
lines:          785

Terminal specs:
colors:         16
characters:     255
rows:           80
columns:        25
cell size:      8×16 pixels
display size:   640×400 pixels

The scope of this project is to
capture the feel of how an 8-bit
graphics card would function in
text mode, with a few pieces of
software using the underlying
graphics engine (p5js) and 
costom-written functions, to show
the capabilities of these seemingly
limiting graphical restrictions.
*/

// Global Variables
program = 0;
var curX = 0;
var curY = 0;
var chrlist = [];
var curCol = "#ffffff";
var cmdstr = [];
var specialKey = "";
var charset = "☺♥♦♣♠★♪⇑⇓∞∋⊆⊇⊂⊃⋃ℕℤℚℝⱯ†ⁿ∨∠ɑ►║▀▐◤◥ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ˇ¡¢£¤¥¦§¨©ª«¬˛®¯˚±²³´µ¶·¸¹º»¼½¾¿ÐÆŒØ×Þẞɔðæœø÷þßəαβΓγΔδεζηɕθικΛλνΞξΠπρΣσςτυΦφχΨΩω░▒▓█▖▗▘▝▚▞▄▌◢◥▪●ƒ∫≈≠─│┌┐└┘├┤┬┴┼€√∛↉⅓⅔⇐⇒≤≥˙ŋʒđє∩⌂";
var DLE = false;
var activeWindow = 1;
var numberOfWindows = 3;
var highlightedElement = 1;
var elementsInWindow = [0, 11, 3, 5]
var bgMemory = [];
var dirDemo = ["document", "image.png", "text", "sound.wav"];
var dirDirs = ["directory", "dir2"];
for (i=0;i<80;i++) {
  bgMemory[i] = [];
  for (j=0;j<25;j++) {
    bgMemory[i][j] = sbg(0);
  }
}

function pB(x, y) {
  rect (x*8, y*16, 8, 16);
}

function tx(x, y, char) {
  text(char, (x*8), (y*16)+13);
}

function cc(character) {
  /*  charset model:
    ☺♥♦♣♠★♪⇑⇓∞∋⊆⊇⊂⊃⋃
    ℕℤℚℝⱯ†ⁿ∨∠ɑ⏵⏸▀▐◤◥
     !"#$%&'()*+,-./
    0123456789:;<=>?
    @ABCDEFGHIJKLMNO
    PQRSTUVWXYZ[\]^_
    `abcdefghijklmno
    pqrstuvwxyz{|}~
    ˇ¡¢£¤¥¦§¨©ª«¬˛®¯
    ˚±²³´µ¶·¸¹º»¼½¾¿
    ÐÆŒØ×Þẞɔðæœø÷þßə
    αβΓγΔδεζηɕθικΛλν
    ΞξΠπρΣσςτυΦφχΨΩω
    ░▒▓█▖▗▘▝▚▞▄▌◢◥▪●
    ƒ∫≈≠─│┌┐└┘├┤┬┴┼€
    √∛↉⅓⅔⇐⇒≤≥˙ŋʒđє∩⌂  */
  if (character >= 32) { // Graphical Character
    if (character != 127) {
      tx(curX, curY, charset.charAt(character));
      if(curX <= 78) {
        curX++;
      } else {
        curX = 0;
        if (curY <= 23) {
          curY++;
        } else {
          curY = 0;
        }
      }
    } else { // Delete character \x7F
      fill(bgMemory[curX][curY]);
      rect (curX*8-1, curY*16, 8, 16);
      fill(curCol);
      if(curX <= 78) {
        curX++;
      } else {
        curX = 0;
        if (curY <= 23) {
          curY++;
        } else {
          curY = 0;
        }
      }
    }
  } else if (DLE) {
    tx(curX, curY, charset.charAt(character));
    DLE = false;
    if(curX <= 78) {
        curX++;
      } else {
        curX = 0;
        if (curY <= 23) {
          curY++;
        } else {
          curY = 0;
        }
      }
  } else {
    if (character == 0) { // Null
      if(curX <= 78) {
        curX++;
      } else {
        curX = 0;
        if (curY <= 23) {
          curY++;
        } else {
          curY = 0;
        }
      }
    } else if (character == 8) { // Backspace 
      if (curX >= 1) {
        curX--;
      } else {
        curX = 0;
        if (curY >= 1) {
          curY--;
        } else {
          curY = 0;
        }
      }
    } else if (character == 10) { // Line Feed
      if (curY <= 24) {
        curY++;
      } else {
        curY = 0;
      }
    } else if (character == 12) { // FF - set cursor to (0;0)
      curX = 0;
      curY = 0;
    } else if (character == 13) { // Carriage Return
      curX = 0;
    } else if (character == 16) { // DLE - Data Link Escape
      DLE = true;
    } else if (character == 17) { // DC1 - Reverse Line Feed
      if (curY >= 1) {
        curY--;
      } else {
        curY = 0;
      }
    } else if (character == 18) { // DC2 - Reverse Carriage Return
      curY = 0;
    } else if (character >= 19 && character <= 27) { // Color Code
      sbg(character) 
    }
  }
}

function sbg (col) {
  if (col == 0)  return "#000000";
  if (col == 1)  return "#0000AA";
  if (col == 2)  return "#00AA00";
  if (col == 3)  return "#00AAAA";
  if (col == 4)  return "#AA0000";
  if (col == 5)  return "#AA00AA";
  if (col == 6)  return "#AA5500";
  if (col == 7)  return "#AAAAAA";
  if (col == 8)  return "#555555";
  if (col == 9)  return "#5555ff";
  if (col == "a" || col == 10) return "#55ff55";
  if (col == "b" || col == 11) return "#55ffff";
  if (col == "c" || col == 12) return "#ff5555";
  if (col == "d" || col == 13) return "#ff55ff";
  if (col == "e" || col == 14) return "#ffff55";
  if (col == "f" || col == 15) return "#ffffff";
}

function nbg(col) {
  curCol = sbg(str(col));
  fill(curCol);
}

function nl() {
  cc(10);
  cc(13);
}

function codeToStr(data) {
  if (data < 256) {
    return charset[data];
  }
}

function strToCode(data) {
  if (charset.includes(data)) {
    return charset.indexOf(data);
  }
}

function diac(letter, diacritic, space) {
  ccString(letter);
  cc(8);
  ccString(diacritic);
  if (space) cc(0);
}

function ccString(string) {
  buffer = [];
  for (i=0;i<string.length;i++) {
    buffer[i] = strToCode(string[i]);
    if (buffer[i] < 32) {
      cc(16);
    }
    cc(buffer[i]);
  }
}

function printString(string) {
  ccString(string);
  nl();
}

function terminalList(user, org, dir) {
  nbg(2);
  ccString("[");
  nbg(15);
  ccString(user);
  nbg(3);
  ccString("@");
  nbg(15);
  ccString(org + " ");
  nbg(12);
  ccString(dir);
  nbg(2);
  ccString("] $ ");
  nbg(7);
}

function clearScreen() {
  for (i=0;i<80;i++) {
    for (j=0;j<25;j++) {
      fill(bgMemory[i][j]);
      pB(i,j);
    }
  }
}

function cmdParse(command) {
  try{
    cmdArray = command.split(" ");
  } catch(TypeError) {
    console.log("TypeError log");
    cmdArray = [""];
  }
  if (cmdArray[0] == "ls") {
    nbg(7);
    ccString(dirDemo[0] + " " + dirDemo[1] + " " + dirDemo[2] + " ");
    nl();
    nbg(9);
    ccString(dirDirs[0] + " " + dirDirs[1]);
    nbg(7);
  } else {
    ccString("Error 1: Unknown command");
  } 
}

function preload() {
   unifont = loadFont("unifont.otf"); 
}

function setup() {
  createCanvas(8*80, 16*25);
  textSize(16);
  textFont(unifont);
  noStroke();
}

function draw() {
  if (program != 1) {
    for (i=0;i<80;i++) {
      for (j=0;j<25;j++) {
        fill(bgMemory[i][j]);
        pB(i,j);
      }
    }
  }
  // program switch
  if (program == 0) {
    cc(12);
    terminalList("videdl003", "edu.linkoping", "scripts");
    ccString("./charset");
    nl();
    //DLE function
    for (i=0;i<32;i++) {
      cc(16);
      cc(i);
      if (i == 15) {
        nl();
      }
    }
    for (i=32;i<256;i++) {
      if (i % 16 == 0) {
        nl();
      }
      cc(i);
    }
    //Pangram
    cc(12);
    nl();
    curX += 19;
    ccString("* The quick brown fox jumped over the lazy dog. (,.;!?:) *");
    curY = 3;
    curX = 18;
    ccString("Symb: ☺♥♦♣♠★♪      ");
    ccString("Misc: ¡¿§¶©®ªº|¦   ");
    ccString("Figures: 0123456789");
    curY = 4; curX = 18;
    ccString("Currency: $¢£¤¥€   ");
    ccString("Fill: ░▒▓█         ");
    ccString("Accents: `´^~ˇ¨˛¯¸˚˙");
    curY = 6; curX = 18;
    ccString("Dots: .·˙▪●");
    diac("n", "~", false);
    /*
    ccString("Symb: ¡¿§¶©®ªº|¦");
    ccString("  Figures: 0123456789");
    ccString("  Accents: `´^~ˇ¨˛¯¸˚˙")
    curY = 4;
    curX = 18;
    ccString("Currency: $¢£¤¥€");
    ccString("  Fill: ░▒▓█");
    curX = 57;
    ccString("Misc:  ÐðđÆæŒœØøÞþẞß");
    curY = 5;
    curX = 18;
    ccString("Dots: .·˙▪●");

    curX = 36;
    ccString("Blocks: ");
    for (i=212;i<222;i++) cc(i);
    ccString("   IPA: ɔəŋʒɕ");
    cc(16);
    cc(25);
    nl();
    nl();
    {
      curX = 18;
      printString("Accented Letters:");
      curX = 18;
      diac("A", "`", false);
      diac("a", "`", true);
      diac("A", "´", false);
      diac("a", "´", true);
      diac("A", "^", false);
      diac("a", "^", true);
      diac("A", "~", false);
      diac("a", "~", true);
      diac("A", "¨", false);
      diac("a", "¨", true);
      diac("A", "˚", false);
      diac("a", "˚", true);
      diac("A", "ˇ", false);
      diac("a", "ˇ", true);
      diac("A", "˛", false);
      diac("a", "˛", true);
      diac("A", "¯", false);
      diac("a", "¯", true);
      diac("A", "¸", false);
      diac("a", "¸", true);
      diac("C", "´", false);
      diac("c", "´", true);
      diac("C", "¸", false);
      diac("c", "¸", true);
      ccString("Ðđ ");
      diac("E", "`", false);
      diac("e", "`", true);
      diac("E", "´", false);
      diac("e", "´", true);
      diac("E", "^", false);
      diac("e", "^", true);
      diac("E", "ˇ", false);
      diac("e", "ˇ", true);
      diac("E", "˛", false);
      diac("e", "˛", true);
      diac("E", "¯", false);
      diac("e", "¯", true);
      diac("E", "¸", false);
      diac("e", "¸", true);
      nl();
      curX += 18;
      diac("E", "¨", false);
      diac("e", "¨", true);
      diac("G", "´", false);
      diac("g", "´", true);
      diac("G", "ˇ", false);
      diac("g", "ˇ", true);
      diac("G", "¯", false);
      diac("g", "¯", true);
      diac("I", "`", false);
      diac("i", "`", true);
      diac("I", "´", false);
      diac("i", "´", true);
      diac("I", "^", false);
      diac("i", "^", true);
      diac("I", "¨", false);
      diac("i", "¨", true);
      diac("N", "~", false);
      diac("n", "~", true);
      diac("O", "`", false);
      diac("o", "`", true);
      diac("O", "´", false);
      diac("o", "´", true);
      diac("O", "^", false);
      diac("o", "^", true);
      diac("O", "~", false);
      diac("o", "~", true);
      diac("O", "¨", false);
      diac("o", "¨", true);
      diac("U", "¨", false);
      diac("u", "¨", true);
      diac("Æ", "¯", false);
      diac("æ", "¯", false);
      nl();
    }
    //Greek
    nl();
    curX += 18;
    ccString("Greek:");
    nl();
    curX += 18;
    ccString("Aα Bβ Γγ Δδ Eε Zζ Hη ");
    diac("O", "·", false);
    printString("θ Iι Kκ Λλ Mµ Nν Ξξ Oo Ππ Pρ Σσς");
    curX += 18;
    ccString("Tτ Yυ Φφ Xχ ΨΨ Ωω");
    //Boxes
    curY += 3;
    curX = 18;
    ccString("Box:") //─│┌┐└┘├┤┬┴┼
    nl();
    curX += 18;
    ccString("┌──┬┐");
    curY += 1;
    curX -= 5;
    ccString("│  ││");
    curY += 1;
    curX -= 5;
    ccString("├──┼┤");
    curY += 1;
    curX -= 5;
    ccString("└──┴┘");
    //Math
    {
      cc(12);
      for (i=0;i<16;i++) {
        cc(10);
      }
      ccString("Math:");
      nl();
      ccString("ƒ(x)=")
      cc(240);
      diac("α", "¯", false);
      ccString("+x²");
      nl();
      ccString("π≈3.1415");
      nl();
      cc(241); //qurt
      diac("x", "¯", false);
      ccString("=±x³");
      nl();
      ccString("∫≠W¹");
    }
    //Color test
    {
      nl();
      nl();
      nbg("c");
      cc(67);
      cc(111);
      nbg("6");
      cc(108);
      nbg("e");
      cc(111);
      nbg("a");
      cc(114);
      cc(32);
      cc(116);
      nbg("b");
      cc(101);
      nbg("9");
      cc(115);
      cc(116);
      nl();
      for (i=0;i<8;i++) {
        nbg(i);
        cc(211);
        cc(211);
      }
      nl();
      nbg(8); //dark gray
      cc(211);
      cc(211);
      nbg(9); //bright blue
      cc(211);
      cc(211);
      nbg("a"); //bright green
      cc(211);
      cc(211);
      nbg("b"); //bright cyan
      cc(211);
      cc(211);
      nbg("c"); //bright red
      cc(211);
      cc(211);
      nbg("d"); //bright magenta
      cc(211);
      cc(211);
      nbg("e"); //bright yellow
      cc(211); 
      cc(211);
      nbg("f"); //bright white
      cc(211); 
      cc(211);
    }
    //Gradient
    {
      cc(17);
      cc(17);
      cc(0);
      nbg(7);
      ccString("Gradient:");
      nl();
      for(i=0;i<18;i++) {
        cc(00);
      }
      nbg(8);
      cc(208);
      cc(209);
      cc(210);
      nbg(7);
      cc(208);
      cc(209);
      cc(210);
      nbg("f");
      cc(209);
      cc(210);
      nbg(7);
    }
    //Fractions
    curY -= 7;
    cc(0);
    ccString("Fractions:")
    nl();
    curX += 27;
    ccString("↉¼ ⅓½ ⅔¾");
    nl();
    //Quasi-brackets
    nl();
    curX += 27;
    ccString("Quasi-brackets:")
    nl();
    curX += 27;
    ccString("<> {} [] «» ⇐⇒ ≤≥");
    nl();
    //Operators
    nl();
    curX += 27;
    ccString("Operators:");
    nl();
    curX += 27;
    ccString("×÷є∩¬");
    //Symbols
    curY -=7;
    curX += 14;
    ccString("Symbols:")
    nl();
    curX += 46;
    ccString("\"#$%&\\_⌂");
    nl();
    //Letters
    nl();
    curX += 46;
    ccString("Letters:")
    nl();
    curX += 46;
    ccString("Aa Bb Cc Dd Ee Ff Gg Hh Ii");
    nl();
    curX += 46;
    ccString("Jj Kk Ll Mm Nn Oo Pp Qq Rr");
    nl();
    curX += 46;
    ccString("Ss Tt Uu Vv Ww Xx Yy Zz");
    */
  }
  if (program == 1) {
    cc(12);
    terminalList("videdl003", "edu.linkoping", "");
    ccString(cmdstr);
    //Blinking cursor
    const d = new Date();
    let seconds = d.getSeconds();
    if (curX < 79 && curX != 0) {
      bgMemory[curX-1][curY] = sbg(0);
      bgMemory[curX][curY] = sbg(0);
      bgMemory[curX+1][curY] = sbg(0);
    } else if (curX == 79) {
      bgMemory[curX-1][curY] = sbg(0);
      bgMemory[curX][curY] = sbg(0);
      bgMemory[curX][curY+1] = sbg(0);
    } else if (curX == 0) {
      bgMemory [79][curY-1] = sbg(0);
      bgMemory [curX][curY] = sbg(0);
      bgMemory [curX+1][curY] = sbg(0);
    }
    if (seconds % 2 == 0) {
      bgMemory[curX][curY] = sbg("f");
    } else {
      bgMemory[curX][curY] = sbg(0);
    }
    nl();
    
  }
  if (program == 2) {
    cc(12);
    for (i=0;i<48;i++) {
      for (j=0;j<16;j++) bgMemory[i][j] = sbg(j);
    }
    for (i=0;i<16;i++) {
      for (j=0;j<16;j++) {
        nbg(j);
        cc(208); //Light shade
        cc(209); //Medium shade
        cc(210); //Dense shade
      }
      nl();
    }
  }
  if (program == 3) {
    cc(12);
    for (i=0;i<80;i++) {
      for (j=0;j<25;j++) bgMemory[i][j] = sbg(0);
    }
    // Window 1 Border
    {
      if (activeWindow == 1) {
        nbg(6);
      } else nbg(7);
      cc(230);
      cc(228);
      ccString("window 1");
      for (i=0;i<10;i++) cc(228);
      cc(231);
      for(i=0;i<23;i++) {
        nl();
        cc(229);
        curX = 20;
        cc(229);
      }
      nl();
      cc(232);
      for (i=0;i<19;i++) cc(228);
      cc(233);
    } 
    // Window 2 Border
    {
      if (activeWindow == 2) {
        nbg(6);
      } else nbg(7);
      curX = 21;
      curY = 0;
      cc(230);
      cc(228);
      ccString("programs");
      for (i=0;i<48;i++) cc(228);
      cc(231);
      for (i=0;i<9;i++) {
        curX = 21;
        cc(229);
        curX = 79;
        cc(229);
      }
      curX = 21;
      cc(232);
      for (i=0;i<57;i++) cc(228);
      cc(233);
    }
    // Window 3 Border
    {
      if (activeWindow == 3) {
        nbg(6);
      } else {
        nbg(7);
      }
      curX = 21;
      curY = 11;
      cc(230);
      cc(228);
      ccString("window 3")
      for (i=0;i<48;i++) cc(228);
      cc(231);
      for (i=0;i<12;i++) {
        curX = 21;
        cc(229);
        curX = 79;
        cc(229);
      }
      curX = 21;
      cc(232);
      for (i=0;i<57;i++) cc(228);
      cc(233);
    }
    // Window 1 Contents
    {
      curX = 1;
      curY = 1;
      nbg(7);
      // highlightedElement
      for (j=0;j<11;j++) {
        if (highlightedElement == j && activeWindow == 1) {
          nbg(6);
        } else nbg(7);
        ccString("Element " + j);
        curY += 1;
        curX = 1;
      }
    }
    // Window 2 Contents
    {
      curX = 22;
      curY = 1;
        if (highlightedElement == 0 && activeWindow == 2) {
          nbg(6);
        } else nbg(7);
        ccString("Terminal");
        curY += 1;
        curX = 22;
      if (highlightedElement == 1 && activeWindow == 2) {
          nbg(6);
        } else nbg(7);
        ccString("Colors");
        curY += 1;
        curX = 22;
      if (highlightedElement == 2 && activeWindow == 2) {
        nbg(6);
      } else nbg(7);
      ccString("Charset");
    }
    // Window 3 Contents
    {
      curX = 22;
      curY = 12;
      for (j=0;j<5;j++) {
        if (highlightedElement == j && activeWindow == 3) {
          nbg(6);
        } else nbg(7);
        ccString("Element " + j);
        curY += 1;
        curX = 22;
      }  
    }
  }
}

function keyTyped() {
  if (keyIsDown(CONTROL) && keyIsDown(90)) {
      program = 3;
    }
  if (program == 1) {
    if (key.length == 1) {
      cmdstr += key;
    } else if (keyIsDown(ENTER)) {
      clearScreen();
      bgMemory[curX][curY] = sbg(0);
      cmdParse(cmdstr);
      cmdstr = "";
    }
  } else if (program == 3) {
    if (key == "d") {
      activeWindow += 1;
      if (activeWindow > numberOfWindows) activeWindow = 1;
      if (highlightedElement > elementsInWindow[activeWindow]) {
          highlightedElement = 0;
      }
    } else if (key == "a") {
      activeWindow -= 1;
      if (activeWindow < 1) activeWindow = 3;
      if (highlightedElement > elementsInWindow[activeWindow]) {
          highlightedElement = 0;
      }
    } else if (key == "s") {
      highlightedElement += 1;
      if (highlightedElement == elementsInWindow[activeWindow]) {
        highlightedElement = 0;
      }
    } else if (key == "w") {
      highlightedElement -= 1;
      if (highlightedElement < 0) {
        highlightedElement = elementsInWindow[activeWindow] -1;
      }
    } else if (key == "Enter") {
      if (highlightedElement == 2 && activeWindow == 2) program = 0;
      if (highlightedElement == 1 && activeWindow == 2) program = 2; 
      if (highlightedElement == 0 && activeWindow == 2) {
        program = 1;
        clearScreen();
      }
    }
  }
}
