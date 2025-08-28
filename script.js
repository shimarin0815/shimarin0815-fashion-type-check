"use strict";

/**
 * 中2でも読めるポイント：
 * - QUESTIONS に質問と選択肢が入ってるよ
 * - 各選択肢は { text, adds: { タイプ名: 点数 } } の形で、押すと点が入る
 * - 最後に合計点がいちばん高いタイプが結果になるよ
 */

// 判定するタイプ（6種類）
const TYPES = {
  clean:   { name: "きれいめカジュアル", desc: "清潔感＋ほどよい上品さ。学校や街でも“きちんと”見える。", colors:["#5C6AC4","#B3C0FF","#FFFFFF","#EDEFFB"], tags:["シャツ","ローファー","細身デニム"], items:["オックスフォードシャツ","テーパードデニム","ローファー","シンプル腕時計"] },
  simple:  { name: "シンプル＆ベーシック", desc: "飽きがこない定番。合わせやすさNo.1で毎日強い。", colors:["#111827","#9CA3AF","#F3F4F6","#FFFFFF"], tags:["無地T","スニーカー","定番色"], items:["無地T(白/黒)","チノパン","ベーシックスニーカー","カーディガン"] },
  street:  { name: "ストリートMIX", desc: "ゆるシルエット×スニーカー。動きやすくて存在感。", colors:["#0F172A","#1F2937","#CBD5E1","#A7F3D0"], tags:["ビッグT","キャップ","スケータームード"], items:["ビッグシルエットT","パーカー","ワイドパンツ","厚底スニーカー"] },
  feminine:{ name: "フェミニン", desc: "やわらかい色と素材で、優しさ漂うムード。", colors:["#FFEDF5","#FFCFE1","#FFF7FB","#8E4B6D"], tags:["パステル","フレア","小物かわいく"], items:["フレアスカート","ボウタイブラウス","バレエシューズ","小さめショルダー"] },
  mode:    { name: "モード", desc: "モノトーンやシャープなラインで大人っぽく。", colors:["#0B0B0B","#2E2E2E","#E5E7EB","#BDBDBD"], tags:["黒多め","直線的","攻めのアイテム"], items:["ブラックテーラード","ストレートスラックス","メタルアクセ","スクエアブーツ"] },
  vintage: { name: "ヴィンテージ/レトロ", desc: "古着の味、柄や色で“個性”を楽しむ達人。", colors:["#7C3A2D","#D1A56E","#F6E7CE","#4B5320"], tags:["古着屋","柄シャツ","一点主役"], items:["レトロ柄シャツ","コーデュロイ","ローファーorダッドスニーカー","ベルト"] },
};

// 7つの質問
const QUESTIONS = [
  {
    q: "よく行く場所は？",
    options: [
      { text:"カフェ・本屋・美術館", adds:{ clean:1, simple:1 } },
      { text:"ショッピングモール・学校", adds:{ simple:1 } },
      { text:"ライブ・スケートパーク", adds:{ street:1 } },
      { text:"古着屋・フリマ", adds:{ vintage:1 } },
      { text:"ギャラリー・夜のイベント", adds:{ mode:1 } },
      { text:"公園・アウトドア", adds:{ street:1, simple:1 } },
    ]
  },
  {
    q: "好きな異性（または友だち）の服装は？",
    options: [
      { text:"白シャツにデニムみたいな“王道”", adds:{ clean:1, simple:1 } },
      { text:"ゆるいパーカーやスニーカー", adds:{ street:1 } },
      { text:"ワンピやフレア、やさしい色", adds:{ feminine:1 } },
      { text:"黒多め・シャープ・ちょい攻め", adds:{ mode:1 } },
      { text:"柄シャツや個性派アイテム", adds:{ vintage:1 } },
    ]
  },
  {
    q: "目指したい雰囲気は？",
    options: [
      { text:"清潔感・上品さ", adds:{ clean:1 } },
      { text:"シンプルで着回し重視", adds:{ simple:1 } },
      { text:"ストリートで存在感", adds:{ street:1 } },
      { text:"やわらかく可愛い", adds:{ feminine:1 } },
      { text:"クールで洗練", adds:{ mode:1 } },
      { text:"レトロで個性的", adds:{ vintage:1 } },
    ]
  },
  {
    q: "好きな色イメージは？",
    options: [
      { text:"白・ネイビー・サックス", adds:{ clean:1 } },
      { text:"白・黒・グレー・ベージュ", adds:{ simple:1 } },
      { text:"黒×差し色（グリーン/ライム）", adds:{ street:1, mode:1 } },
      { text:"パステル（ピンク/ラベンダー）", adds:{ feminine:1 } },
      { text:"ブラウン/からし/深緑など渋色", adds:{ vintage:1 } },
    ]
  },
  {
    q: "トップスの形、どれが落ち着く？",
    options: [
      { text:"シャツやニット、少しジャスト", adds:{ clean:1 } },
      { text:"無地Tやスウェット、ふつう丈", adds:{ simple:1 } },
      { text:"ビッグT/フーディでゆるっと", adds:{ street:1 } },
      { text:"ブラウス/カーデで軽やか", adds:{ feminine:1 } },
      { text:"直線的シルエット/タイトめ", adds:{ mode:1 } },
      { text:"古着の一点モノ", adds:{ vintage:1 } },
    ]
  },
  {
    q: "休日の足元は？",
    options: [
      { text:"ローファー/きれいめスニーカー", adds:{ clean:1 } },
      { text:"白スニーカーなど定番", adds:{ simple:1 } },
      { text:"ボリュームスニーカー", adds:{ street:1 } },
      { text:"バレエ/パンプス", adds:{ feminine:1 } },
      { text:"スクエアブーツ", adds:{ mode:1 } },
      { text:"革靴/レトロスニーカー", adds:{ vintage:1 } },
    ]
  },
  {
    q: "小物でテンション上がるのは？",
    options: [
      { text:"革ベルト/シンプル腕時計", adds:{ clean:1, simple:1 } },
      { text:"キャップ/チェーンネックレス", adds:{ street:1 } },
      { text:"リボン/小さめショルダー", adds:{ feminine:1 } },
      { text:"メタル/幾何学っぽいアクセ", adds:{ mode:1 } },
      { text:"レトロ柄スカーフ", adds:{ vintage:1 } },
    ]
  },
];

// 状態
let index = 0;
let chosen = []; // 各問の選択肢番号
let scores = resetScores();

// DOM
const qArea = document.getElementById("question-area");
const progressBar = document.getElementById("progress-bar");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const sectionQuiz = document.getElementById("quiz");
const sectionResult = document.getElementById("result");

// 年表示
document.getElementById("year").textContent = new Date().getFullYear();

// 初期表示
renderQuestion();
updateProgress();
btnPrev.addEventListener("click", onPrev);
btnNext.addEventListener("click", onNext);
document.getElementById("retry").addEventListener("click", resetAll);

function resetScores(){
  return { clean:0, simple:0, street:0, feminine:0, mode:0, vintage:0 };
}

function renderQuestion(){
  const { q, options } = QUESTIONS[index];
  qArea.innerHTML = `
    <h2><span style="color:#7c8cff">Q${index+1}.</span> ${q}</h2>
    <div class="options" role="listbox" aria-label="選択肢">
      ${options.map((op, i) => `
        <button class="option ${chosen[index]===i ? "selected":""}" data-i="${i}">
          ${op.text}
        </button>
      `).join("")}
    </div>
  `;
  qArea.querySelectorAll(".option").forEach(btn=>{
    btn.addEventListener("click",()=>{
      selectOption(parseInt(btn.dataset.i,10));
    });
  });

  btnPrev.disabled = index === 0;
  btnNext.textContent = index === QUESTIONS.length - 1 ? "結果を見る →" : "次へ →";
}

function selectOption(i){
  chosen[index] = i;
  // UI更新
  qArea.querySelectorAll(".option").forEach(el=>el.classList.remove("selected"));
  qArea.querySelector(`.option[data-i="${i}"]`).classList.add("selected");
}

function onPrev(){
  if(index>0){ index--; renderQuestion(); updateProgress(); }
}

function onNext(){
  if(chosen[index] == null){
    // やさしく注意
    btnNext.animate([{transform:"translateY(0)"},{transform:"translateY(-3px)"}],{duration:80,direction:"alternate",iterations:2});
    return;
  }
  if(index < QUESTIONS.length - 1){
    index++;
    renderQuestion();
    updateProgress();
  }else{
    // 集計
    scores = tallyScores();
    showResult();
  }
}

function tallyScores(){
  const s = resetScores();
  chosen.forEach((optIndex, qIndex)=>{
    const adds = QUESTIONS[qIndex].options[optIndex].adds;
    Object.entries(adds).forEach(([k,v])=> s[k]+=v);
  });
  return s;
}

function updateProgress(){
  const pct = Math.round((index)/QUESTIONS.length*100);
  progressBar.style.width = `${pct}%`;
}

function topTypes(){
  const arr = Object.entries(scores).map(([k,v])=>({key:k,score:v}));
  arr.sort((a,b)=> b.score - a.score);
  return arr; // 1位,2位…の順
}

function showResult(){
  sectionQuiz.classList.add("hidden");
  sectionResult.classList.remove("hidden");

  const ranking = topTypes();
  const first = TYPES[ranking[0].key];
  const second = ranking[1] ? TYPES[ranking[1].key] : null;

  const title = document.getElementById("result-title");
  const desc = document.getElementById("result-desc");
  const tags = document.getElementById("result-tags");
  const palette = document.getElementById("palette");
  const suggest = document.getElementById("suggest-list");

  title.textContent = `あなたのタイプは「${first.name}」`;
  desc.textContent = second
    ? `次点は「${second.name}」。この2つをミックスすると、さらに“らしさ”が出るよ。`
    : `直感で選んだ結果だよ。今日からコーデで試してみよう！`;

  // タグ
  tags.innerHTML = "";
  first.tags.forEach(t=>{
    const el = document.createElement("span");
    el.className = "tag";
    el.textContent = `#${t}`;
    tags.appendChild(el);
  });

  // パレット
  palette.innerHTML = "";
  first.colors.forEach(c=>{
    const sw = document.createElement("div");
    sw.className = "swatch";
    sw.style.background = c;
    sw.title = c;
    palette.appendChild(sw);
  });

  // アイテム
  suggest.innerHTML = "";
  first.items.forEach(i=>{
    const li = document.createElement("li");
    li.textContent = i;
    suggest.appendChild(li);
  });

  // X シェア
  const share = document.getElementById("share-x");
  const text = `診断結果：${first.name} でした！ #ファッションタイプ診断`;
  const url = location.href;
  share.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

function resetAll(){
  index = 0; chosen = []; scores = resetScores();
  sectionResult.classList.add("hidden");
  sectionQuiz.classList.remove("hidden");
  renderQuestion(); updateProgress();
}
