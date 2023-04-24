let lastelement = "blueippon";
let currentfontsize = "15";
let mainClockRunning = 0;
let globalOsaekomiClockRunning = 0;
let centralClockRunning = false;
let osaeClockRunning = false;
let wazari_2_ippon = 1;
let mainSeconds = 0;
let mainMinutes = 2;
let globalOsaeSeconds = 0;
let defaultmatch = "2:00";
let defaultMainSeconds = 0;
let defaultMainMinutes = 4;
let isGoldenScore = false;
let OsaeKomiAutoScore = 1;
let OsaeKomiMaxTime = 20;
let OsaeKomiWazariTime = 10;
let goldenScoreTimeSecs = 30000;
let limitGoldenScoreDuration = 0;
let double_digit = 0;
let ijf_2017_rules = 1;
let colourscheme = 0;
let traditional = 0;
let bell_enabled = true;

let mac = null;
let whitepenalty_click = 0;
let bluepenalty_click = 0;
let localdb = false;
let preferred_bell = 0;


function hajime_matte() {
  if (document.getElementById("hajimeswitch").innerHTML == "Hajime") {
    centralClockRunning = true;
    document.getElementById("hajimeswitch").innerHTML = "Matte";
    bell_enabled = true;
    if (document.getElementById("goldenscore").innerHTML != "Gs") {
      document.getElementById("goldenscore").innerHTML = "&nbsp;";
    }
    if (
      document.getElementById("globalfreezeswitch").innerHTML == "Yoshi" &&
      document.getElementById("globalholddownswitch").innerHTML == "Toketa"
    ) {
      document.getElementById("globalfreezeswitch").innerHTML = "Sonomama";
      osaeClockRunning = true;
    }
    if (document.getElementById("globalholddownswitch").innerHTML == "Toketa") {
      document.getElementById("globalfreezeswitch").innerHTML = "Sonomama";
    }
    document.getElementById("globalfreezeswitch").innerHTML = "Sonomama";
  } else {
    bell_enabled = false;
    centralClockRunning = false;
    document.getElementById("hajimeswitch").innerHTML = "Hajime";
  }
}
function gotoclockoptions() {
  if (document.getElementById("hajimeswitch").innerHTML == "Matte") {
    hajime_matte();
  }
  window.location = "#default_matchtimes";
}
function parse_seconds(strCurrentTime) {
  let a = strCurrentTime.split(":");
  let count = a.length;
  let minutes = 0;
  let seconds = 0;
  let answer = 0;
  if (count > 1) {
    minutes = parseInt(a[0]);
    seconds = parseInt(a[1]);
  } else {
    seconds = parseInt(strCurrentTime);
  }
  answer = minutes * 60 + seconds;
  return answer;
}
function paint_mainclock(secs) { 
  let tmins = 0;
  let tsecs = 0;
  let tsecsStr = "";
  let bldstr = "";
  if (secs > 59) {
    tmins = Math.floor(secs / 60);
    tsecs = secs % 60;
  } else {
    tmins = 0;
    tsecs = secs;
  }
  if (tsecs < 10) {
    tsecsStr = "0" + tsecs.toString();
  } else {
    tsecsStr = tsecs.toString();
  }
  bldstr = tmins.toString() + ":" + tsecsStr;
  document.getElementById("mainclock").innerHTML = bldstr;
}
//this function is called at the end of the html file.
function masterstopwatch() {
  const clockreading = document.getElementById("mainclock").innerHTML;
  const osaereading = document.getElementById("globalosaekomi").innerHTML;
  let centralClockSeconds = parse_seconds(clockreading.toString());
  let osaeClockSeconds = parse_seconds(osaereading);
  if (centralClockRunning) {
    if (!isGoldenScore) {
      centralClockSeconds--;
    } else {
      centralClockSeconds++;
    }
    if (centralClockSeconds < 1) {
      centralClockSeconds = 0;
    }
    if (centralClockSeconds > 3599) {
      centralClockSeconds = 3600;
    }
    paint_mainclock(centralClockSeconds);
    if (centralClockSeconds < 1) {
      document.getElementById("goldenscore").innerHTML = "!";
      if (!osaeClockRunning) {
        ring_bell();
      }
    }
  }
  if (osaeClockRunning && centralClockRunning) {
    osaeClockSeconds++;
    console.log('OsaeKomiAutoScore :>> ', OsaeKomiAutoScore);
    if (OsaeKomiAutoScore > 0) {
      if (osaeClockSeconds == OsaeKomiWazariTime) {
        if (
          document.getElementById("globalosaekomitoriwhite").innerHTML == "Tori"
        ) {
          changescore("whitewazari", 1);
        }
        if (
          document.getElementById("globalosaekomitoriblue").innerHTML == "Tori"
        ) {
          changescore("bluewazari", 1);
        }
      }
      if (osaeClockSeconds == OsaeKomiMaxTime) {
        if (
          document.getElementById("globalosaekomitoriwhite").innerHTML == "Tori"
        ) {
          changescore("whiteippon", 1);
        }
        if (
          document.getElementById("globalosaekomitoriblue").innerHTML == "Tori"
        ) {
          changescore("blueippon", 1);
        }
      }
    }
    if (osaeClockSeconds < 1) {
      osaeClockSeconds = 0;
    }
    if (osaeClockSeconds > OsaeKomiMaxTime) {
      ring_bell();
      centralClockRunning = false;
      osaeClockRunning = false;
      document.getElementById("goldenscore").innerHTML = "!";
      hajime_matte();
      osaeClockSeconds = OsaeKomiMaxTime;
    }
    document.getElementById("globalosaekomi").innerHTML =
      osaeClockSeconds.toString();
  }
  if (isGoldenScore) {
    if (limitGoldenScoreDuration) {
      if (centralClockSeconds >= goldenScoreTimeSecs) {
        ring_bell();
        centralClockRunning = false;
      }
    }
  }
  mac = window.setTimeout(masterstopwatch, 1000);
}
function resetOsae(whichcolour) {
  osaeClockRunning = false;
  document.getElementById("globalholddownswitch").innerHTML = "Osaekomi";
  document.getElementById("globalosaekomi").innerHTML = "0";
  resettoriprompt();
}
function globalholddown() {
  let defaultstartvalue = 0;
  if (document.getElementById("globalholddownswitch").innerHTML == "Osaekomi") {
    document.getElementById("globalosaekomi").innerHTML = "0";
    document.getElementById("globalholddownswitch").innerHTML = "Toketa";
    osaeClockRunning = true;
    centralClockRunning = true;
    if (document.getElementById("hajimeswitch").innerHTML.trim() == "Hajime") {
      document.getElementById("hajimeswitch").innerHTML = "Matte";
    }
  } else {
    document.getElementById("globalholddownswitch").innerHTML = "Osaekomi";
    osaeClockRunning = false;
  }
}
function globalfreeze() {
  if (document.getElementById("globalfreezeswitch").innerHTML == "Sonomama") {
    document.getElementById("globalfreezeswitch").innerHTML = "Yoshi";
    document.getElementById("hajimeswitch").innerHTML = "Hajime";
    centralClockRunning = false;
    osaeClockRunning = false;
  } else {
    centralClockRunning = true;
    document.getElementById("globalfreezeswitch").innerHTML = "Sonomama";
    document.getElementById("hajimeswitch").innerHTML = "Matte";
    if (document.getElementById("globalholddownswitch").innerHTML == "Toketa") {
      osaeClockRunning = true;
    }
  }
}
function nominateosaetori(whichplayer) {
  document.getElementById("globalosaekomitoriprompt").style.display = "none";
  if (whichplayer == 0) {
    document.getElementById("globalosaekomitoriblue").style.width = "15%";
    document.getElementById("globalosaekomitoriwhite").style.width = "84%";
    document.getElementById("globalosaekomitoriblue").innerHTML = "";
    document.getElementById("globalosaekomitoriwhite").innerHTML = "Tori";
  }
  if (whichplayer == 1) {
    document.getElementById("globalosaekomitoriwhite").style.width = "15%";
    document.getElementById("globalosaekomitoriblue").style.width = "84%";
    document.getElementById("globalosaekomitoriblue").innerHTML = "Tori";
    document.getElementById("globalosaekomitoriwhite").innerHTML = "";
  }
}
function resettoriprompt() {
  document.getElementById("globalosaekomitoriblue").style.width = "15%";
  document.getElementById("globalosaekomitoriwhite").style.width = "15%";
  document.getElementById("globalosaekomitoriblue").innerHTML = "";
  document.getElementById("globalosaekomitoriwhite").innerHTML = "";
  document.getElementById("globalosaekomitoriprompt").style.display = "block";
}
function changescore(divid, updown) {
  let currentscore;
  let currentscorestr;
  currentscore = Number(document.getElementById(divid).innerHTML);
  if (updown == 1) {
    currentscore++;
  } else {
    currentscore--;
  }
  if (currentscore < 0) {
    currentscore = 0;
  }
  if (currentscore > 2) {
    currentscore = 2;
  }
  currentscorestr = currentscore.toString();
  if (double_digit == 1) {
    if (divid == "whitewazari" || divid == "bluewazari") {
      if (currentscore < 10) {
        currentscorestr = "0" + currentscorestr;
      }
      document.getElementById(divid).innerHTML = currentscorestr;
    } else {
      document.getElementById(divid).innerHTML = currentscore;
    }
  } else {
    document.getElementById(divid).innerHTML = currentscore;
  }
  lastelement = divid;
  if (
    document.getElementById("goldenscore").innerHTML == "Gs" &&
    centralClockRunning &&
    updown == 1
  ) {
  }
  if (centralClockRunning) {
    if (
      (divid == "blueippon" || divid == "whiteippon") &&
      document.getElementById("goldenscore").innerHTML != "Gs" &&
      updown == 1
    ) {
    }
  }
  if (wazari_2_ippon && (divid == "bluewazari" || divid == "whitewazari")) {
    if (divid == "bluewazari") {
      if (currentscore == 2) {
        changescore("blueippon", 1);
        if (document.getElementById("hajimeswitch").innerHTML == "Matte") {
          hajime_matte();
        }
      }
    } /// if blue
    if (divid == "whitewazari") {
      if (currentscore == 2) {
        changescore("whiteippon", 1);
        if (document.getElementById("hajimeswitch").innerHTML == "Matte") {
          hajime_matte();
        }
      }
    } /// if blue
  }
}
function changepenalty(divid, updown) {
  let oldpenalty;
  let newpenalty;
  oldpenalty = Number(document.getElementById(divid).innerHTML);
  newpenalty = oldpenalty;
  if (updown == 1) {
    newpenalty++;
  } else {
    newpenalty--;
  }
  if (newpenalty < 0) {
    newpenalty = 0;
  }
  if (newpenalty > 3) {
    newpenalty = 3;
  }
  document.getElementById(divid).innerHTML = newpenalty;
  if (newpenalty >= 3) {
    document.getElementById(divid).style.backgroundColor = "#ff0000";
    document.getElementById(divid).style.color = "#000000";
    if (document.getElementById("hajimeswitch").innerHTML == "Matte") {
      hajime_matte();
    }
  } else {
    document.getElementById(divid).style.backgroundColor = "#ffff00";
    document.getElementById(divid).style.color = "#ff0000";
  }
}
function resetGoldScore() {
  isGoldenScore = true;
  let tempmatchstr = "0:00";
  centralClockRunning = false;
  osaeClockRunning = false;
  document.getElementById("goldenscore").innerHTML = "Gs";
  document.getElementById("mainclock").innerHTML = tempmatchstr;
  document.getElementById("hajimeswitch").innerHTML = "Hajime";
  document.getElementById("globalholddownswitch").innerHTML = "Osaekomi";
  document.getElementById("globalosaekomi").innerHTML = "0";
  resettoriprompt();
  bell_enabled = true;
}
function setdefaultmatch(clocklabel, mins, secs) {
  let j = 0;
  defaultMainMinutes = mins;
  defaultMainSeconds = secs;
  defaultmatch = clocklabel;
  if (limitGoldenScoreDuration) {
    goldenScoreTimeSecs = Math.round(
      (defaultMainMinutes * 60 + defaultMainSeconds) / 2
    );
  } else {
    goldenScoreTimeSecs = 30000;
  }
  resetAll();
}
function resetAll() {
  centralClockRunning = false;
  osaeClockRunning = false;
  isGoldenScore = false;
  document.getElementById("goldenscore").innerHTML = "&nbsp;";
  document.getElementById("mainclock").innerHTML = defaultmatch;
  document.getElementById("hajimeswitch").innerHTML = "Hajime";
  document.getElementById("globalholddownswitch").innerHTML = "Osaekomi";
  document.getElementById("globalosaekomi").innerHTML = "0";
  document.getElementById("blueippon").innerHTML = "0";
  document.getElementById("whiteippon").innerHTML = "0";
  document.getElementById("whitewazari").innerHTML = "0";
  document.getElementById("bluewazari").innerHTML = "0";
  document.getElementById("bluepenalty").innerHTML = "0";
  document.getElementById("whitepenalty").innerHTML = "0";
  document.getElementById("bluepenalty").style.backgroundColor = "#ffff00";
  document.getElementById("bluepenalty").style.color = "#ff0000";
  document.getElementById("whitepenalty").style.backgroundColor = "#ffff00";
  document.getElementById("whitepenalty").style.color = "#ff0000";
  changematch(1);
  bell_enabled = true;
  disableSpacekey();
  resettoriprompt();
}
function changemat(updown) {
  const s = document.getElementById("matnum").innerHTML;
  const current = s.charAt(7);
  let i = Number(current);
  if (updown == 1) {
    i++;
  } else {
    i--;
  }
  if (i < 1) {
    i = 1;
  }
  if (i > 8) {
    i = 8;
  }
  document.getElementById("matnum").innerHTML = "Tatami " + String(i);
  document.getElementById("matnum_pref").innerHTML = "Tatami " + String(i);
}
function changematch(updown) {
  const s = document.getElementById("matchnum").innerHTML;
  const current = s.slice(6);
  let i = Number(current);
  if (updown == 1) {
    i++;
  } else {
    i--;
  }
  if (i < 1) {
    i = 1;
  }
  document.getElementById("matchnum").innerHTML = "Shiai " + String(i);
  setNextPlayers(i)
}
function legGrab(elid) {
  let legcolor = "#ffaadd";
  let nonlegcolor = "#ffff00";
  if (elid == "bluepenalty") {
    if (bluepenalty_click == 0) {
      bluepenalty_click = 1;
      document.getElementById(elid).style.backgroundColor = legcolor;
      changepenalty("bluepenalty", 1);
    } else {
      bluepenalty_click = 0;
      document.getElementById(elid).style.backgroundColor = nonlegcolor;
    }
  } else {
    if (whitepenalty_click == 0) {
      whitepenalty_click = 1;
      document.getElementById(elid).style.backgroundColor = legcolor;
      changepenalty("whitepenalty", 1);
    } else {
      whitepenalty_click = 0;
      document.getElementById(elid).style.backgroundColor = nonlegcolor;
    }
  }
}
function changeHand(elid) {
  let opacity = document.getElementById(elid).style.opacity;
  if (opacity < 0.5) {
    document.getElementById(elid).style.opacity = 1.0;
    if (elid == "whitehand1" || elid == "whitehand2") {
      changepenalty("whitepenalty", 1);
    }
    if (elid == "bluehand1" || elid == "bluehand2") {
      changepenalty("bluepenalty", 1);
    }
  } else {
    document.getElementById(elid).style.opacity = 0.2;
    if (elid == "whitehand1" || elid == "whitehand2") {
      changepenalty("whitepenalty", 0);
    }
    if (elid == "bluehand1" || elid == "bluehand2") {
      changepenalty("bluepenalty", 0);
    }
  }
}
function manage_golden_score(elid) {
  let limitgs = document.getElementById(elid).value;
  if (limitgs < 1000) {
    limitGoldenScoreDuration = true;
    goldenScoreTimeSecs = Math.round(
      (defaultMainMinutes * 60 + defaultMainSeconds) / 2
    );
  } else {
    limitGoldenScoreDuration = false;
    goldenScoreTimeSecs = 30000;
  }
}

function update_welcome() {
  document.getElementById("welcome_msg").innerHTML =
    document.getElementById("welcome_input").value;
  window.location = "#pagetop";
  disableSpacekey();
}
function change_msg_colour(newcolour) {
  document.getElementById("welcome_table").style.backgroundColor = newcolour;
}
function setOsaeKomiScoring(selectid, target) {
  let sel = document.getElementById(selectid).value;
  if (target == "a") {
    OsaeKomiAutoScore = sel;
    if (sel != 1) {
      document.getElementById("autoscore_wazari_1").style.visibility = "hidden";
      document.getElementById("autoscore_wazari_2").style.visibility = "hidden";
    } else {
      document.getElementById("autoscore_ippon_1").style.visibility = "visible";
      document.getElementById("autoscore_ippon_2").style.visibility = "visible";
      document.getElementById("autoscore_wazari_1").style.visibility =
        "visible";
      document.getElementById("autoscore_wazari_2").style.visibility =
        "visible";
    }
  }
  if (target == "i") {
    OsaeKomiMaxTime = sel;
  }
  if (target == "w") {
    OsaeKomiWazariTime = sel;
  }
}

function ring_bell() {
  if (bell_enabled) {
    if (preferred_bell == 0) {
      document.getElementById("audiotagbell").play();
    }
    if (preferred_bell == 1) {
      document.getElementById("audiotagbuzzer").play();
    }
    if (preferred_bell == 2) {
      document.getElementById("audiotagsiren").play();
    }
    if (preferred_bell == 3) {
      document.getElementById("audiotagchime").play();
    }
    bell_enabled = false;
  }
}
function force_bell() {
  let old_state = bell_enabled;
  bell_enabled = true;
  ring_bell();
  bell_enabled = old_state;
}

function testbell(whichbell) {
  let old_enabled = bell_enabled;
  let old_preferred = preferred_bell;
  preferred_bell = whichbell;
  bell_enabled = true;
  ring_bell();
  preferred_bell = old_preferred;
  bell_enabled = old_enabled;
}

//we need to toggle when the user is making a text input in players or name
let spacekeyDisabled = true;
function enableSpacekey() {
  spacekeyDisabled = false;
}
function disableSpacekey() {
  spacekeyDisabled = true;
}

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (spacekeyDisabled) {
    if (evt.keyCode == 32) {
      hajime_matte();
      return false;
    }
    if (evt.keyCode == 79) {
      globalholddown();
      return false;
    }
    if (evt.keyCode == 84) {
      globalholddown();
      return false;
    }
  }
};

function dbinit() {
 
  localdb = true;
  let rawnames = localStorage.getItem("allplayers");

  if (rawnames != null) {
    if (rawnames.length < 6) {
      rawnames = "Player 1\nPlayer 2";
    }
  } else {
    rawnames = "Player 1\nPlayer 2";
  }
  document.getElementById("playersnames").value = rawnames;
  updateplayers();

  let show_instruction_host = "www.scorejudo.com";
  let proto = location.hostname;
  if (proto == show_instruction_host) {
    document.getElementById("download_intruct").style.display = "block";
  }
  setOsaeKomiScoring("setOKomiAutoScore", "a");
  setNextPlayers(1)
}
function capitalize(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
function mysort(arrayname) {
  let newarray = [];
  let s = "";
  for (const element of arrayname) {
    s = trimstr(element);
    if (s.length > 2) {
      s = s.toLowerCase();
      s = capitalize(s);
      newarray.push(s);
    }
  }
  return newarray;
}

function trimstr(str) {
  let s = str.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  s = s.replace("\r", "");
  s = s.replace("\n", "");
  return s;
}

function updateplayers() {
  let data = document.getElementById("playersnames").value;
  let namess = data.split("\n");
  let names = mysort(namess);
  let rawnames = "";
  for (let j = 0; j < names.length; j++) {
    if (names[j].length > 2) {
      rawnames = rawnames + names[j];
      if (j < names.length - 1) {
        rawnames = rawnames + "\r\n";
      }
    }
  }
  let elementw = document.getElementById("whiteplayername");
  while (elementw.firstChild) {
    elementw.removeChild(elementw.firstChild);
  }
  let selectw = document.getElementById("whiteplayername");
  let optionsw = selectw.options;
  for (let j = 0; j < names.length; j++) {
    optionsw[j] = new Option(names[j]);
  }
  let elementb = document.getElementById("blueplayername");
  while (elementb.firstChild) {
    elementb.removeChild(elementb.firstChild);
  }
  let selectb = document.getElementById("blueplayername");
  let optionsb = selectb.options;
  for (let j = 0; j < names.length; j++) {
    optionsb[j] = new Option(names[j], names[j]);
  }
  let editTextarea = document.getElementById("playersnames");
  editTextarea.value = rawnames;
  if (localdb) {
    localStorage.setItem("allplayers", rawnames);
  }
}
function navigate_to(elid) {
  window.location = elid;
  if (elid == "#kanoportrait") {
    startTime();
  }
  if (elid == "#pagetop") {
    disableSpacekey();
  }
}

function setNextPlayers(matchNumber) {
  let rawnames = localStorage.getItem("allplayers");
  const players = mysort(rawnames.split("\n"));
  console.log("players", players);
  const index = matchNumber + (matchNumber -2)
  document.getElementById("whiteplayername").value = players[index];
  document.getElementById("blueplayername").value = players[index +1];
}


