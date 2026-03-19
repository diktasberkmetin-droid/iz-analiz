// 1. SORU BANKASI VE DEĞİŞKENLER
let currentQuestion = 0;
let totalCarbon = 0;
let userName = "";

const questions = [
    { text: "Haftada kaç kez kırmızı et tüketirsiniz?", factor: 312 }, // kg CO2/yıl (Porsiyon başı)
    { text: "Evde elektrik faturanız aylık ortalama kaç TL?", factor: 0.5 }, // Kabaca bir katsayı
    { text: "Yıllık kaç kez uçakla seyahat edersiniz?", factor: 500 },
    { text: "Günlük ortalama kaç km araba sürersiniz?", factor: 150 },
    { text: "Evinizde ısı yalıtımı var mı? (Var: 0, Yok: 1)", factor: 1000 },
    { text: "Haftada kaç litre süt ürünü tüketirsiniz?", factor: 100 },
    { text: "Yıllık kaç yeni kıyafet alırsınız?", factor: 50 },
    { text: "Geri dönüşüm yapar mısınız? (Evet: 0, Hayır: 1)", factor: 500 },
    { text: "Eviniz kaç metrekare?", factor: 10 },
    { text: "Sıcak su için ne kullanıyorsunuz? (Güneş: 0, Diğer: 1)", factor: 400 }
];

// 2. UYGULAMAYI BAŞLAT
function startApp() {
    userName = document.getElementById('nameInput').value;
    if (!userName) {
        alert("Lütfen isminizi girin!");
        return;
    }
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('question-screen').style.display = 'block';
    document.getElementById('userGreeting').innerText = `Merhaba ${userName}, başlayalım!`;
    showQuestion();
}

// 3. SORULARI GÖSTER
function showQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('questionText').innerText = q.text;
    document.getElementById('answerInput').value = "";
    // İlerleme çubuğu
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// 4. CEVABI İŞLE VE SIRADAKİNE GEÇ
function handleNext() {
    const answer = parseFloat(document.getElementById('answerInput').value);
    if (isNaN(answer)) {
        alert("Lütfen geçerli bir sayı girin!");
        return;
    }

    totalCarbon += answer * questions[currentQuestion].factor;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showFinalResult();
    }
}

// 5. FİNAL EKRANI VE HESAPLAMALAR
function showFinalResult() {
    document.getElementById('question-screen').style.display = 'none';
    const resultScreen = document.getElementById('result-screen');
    resultScreen.style.display = 'block';

    const finalKg = Math.round(totalCarbon);
    document.getElementById('finalScore').innerText = `Yıllık Tahmini Karbon Ayak İziniz: ${finalKg} kg CO2`;

    // Dünya Ortalaması Kıyaslaması
    const worldAvg = 4700;
    const diff = ((finalKg - worldAvg) / worldAvg) * 100;
    const percentDiv = document.getElementById('worldPercent');

    if (finalKg > worldAvg) {
        percentDiv.innerHTML = `<span style="color: #ef4444;">Dünya ortalamasından %${Math.abs(Math.round(diff))} daha fazlasınız.</span>`;
    } else {
        percentDiv.innerHTML = `<span style="color: #10b981;">Dünya ortalamasından %${Math.abs(Math.round(diff))} daha iyisiniz!</span>`;
    }

    // Rozet ve Grafik Çağır
    awardBadge(finalKg);
    createChart(finalKg);
}

// 6. ROZET SİSTEMİ
function awardBadge(userKg) {
    const badgeContainer = document.getElementById('badge-container');
    const icon = document.getElementById('badge-icon');
    const rank = document.getElementById('userRank');
    const desc = document.getElementById('rankDesc');

    // 1. İçeriği hazırla
    if (userKg < 3500) {
        icon.innerHTML = "🌟";
        rank.innerHTML = "Yeşil Kahraman";
        desc.innerHTML = "Doğayı koruyan harika bir yaşam tarzınız var!";
        window.userStatusForShare = "Yeşil Kahraman 🌟";
    } else if (userKg < 7500) {
        icon.innerHTML = "🌱";
        rank.innerHTML = "Eko-Gezgin";
        desc.innerHTML = "Fena değil, ama birkaç değişiklikle dünyayı kurtarabilirsiniz.";
        window.userStatusForShare = "Eko-Gezgin 🌱";
    } else {
        icon.innerHTML = "⚠️";
        rank.innerHTML = "Karbon Devi";
        desc.innerHTML = "İziniz çok büyük! Yaşam tarzınızı hemen değiştirmelisiniz.";
        window.userStatusForShare = "Karbon Devi ⚠️";
    }

    // 2. Animasyonu gecikmeli başlat (Daha profesyonel hissettirir)
    setTimeout(() => {
        badgeContainer.classList.add('badge-animate');
    }, 500); // 0.5 saniye sonra rozet patlar
}

// 7. GRAFİK OLUŞTURMA (Chart.js)
function createChart(userKg) {
    const ctx = document.getElementById('carbonChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sizin İziniz', 'Dünya Ortalaması'],
            datasets: [{
                label: 'kg CO2',
                data: [userKg, 4700],
                backgroundColor: [userKg > 4700 ? '#ef4444' : '#10b981', '#94a3b8'],
                borderRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// 8. SOSYAL PAYLAŞIM
function shareOnSocial() {
    const scoreText = document.getElementById('finalScore').innerText;
    const kg = scoreText.match(/\d+/)[0]; 
    const status = window.userStatusForShare || "Doğa Dostu";
    
    const text = `İz Analiz testimde rütbem ${status} çıktı! Yıllık karbon izim ${kg} kg CO2. Sen de ölçmek ister misin?`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
}
function goToSimulation() {
    // Mevcut puanı tarayıcı hafızasına kaydet
    const scoreText = document.getElementById('finalScore').innerText;
    const kg = scoreText.match(/\d+/)[0]; 
    localStorage.setItem('userCarbonScore', kg);
    
    // Yeni sayfaya yönlendir
    window.location.href = 'senin-dunyan.html';
}