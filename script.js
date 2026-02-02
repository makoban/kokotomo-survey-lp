// ===== フォーム送信処理 (Web3Forms) =====
function confirmAndSend() {
    // 1. 入力値の取得
    const company = document.getElementById('company').value || '';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const tel = document.getElementById('tel').value || '';
    const interest = document.getElementById('interest').value || '';
    const message = document.getElementById('message').value || '';

    // 2. 送信前確認
    const confirmMsg = `以下の内容で送信します。よろしいですか？\n\n【会社名】${company}\n【お名前】${name}\n【メール】${email}\n【電話番号】${tel}\n【興味のある内容】${interest}\n【お問い合わせ】${message}`;

    if (!confirm(confirmMsg)) {
        return; // キャンセルなら送信しない
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;

    // 3. Web3Formsの設定
    const accessKey = '18e5fc30-492e-4cbc-994f-50baddd58d4c';

    // 4. 送信データを作成
    const formData = {
        access_key: accessKey,
        subject: '【ココトモLP】お問い合わせ・無料体験申し込み',
        from_name: 'Kokotomo LP',
        company: company,
        name: name,
        email: email,
        tel: tel,
        interest: interest,
        message: message
    };

    // 5. 送信実行
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // 送信成功
            document.getElementById('successModal').style.display = 'flex';
            document.getElementById('contactForm').reset();
        } else {
            console.error('送信エラー:', result);
            alert('送信に失敗しました。時間をおいて再度お試しください。');
        }
    })
    .catch(error => {
        console.error('通信エラー:', error);
        alert('通信エラーが発生しました。ネットワーク環境をご確認ください。');
    })
    .finally(() => {
        submitBtn.textContent = '📤 確認して送信する';
        submitBtn.disabled = false;
    });
}

// モーダルを閉じる関数
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// ===== フォーム送信 =====
document.getElementById('surveyForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    // チェックボックスの値を配列として取得
    const interests = [];
    document.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
        interests.push(cb.value);
    });

    // 送信データを作成
    const data = {
        interests: interests,
        budget: formData.get('budget'),
        ideas: formData.get('ideas'),
        company_name: formData.get('company_name'),
        department: formData.get('department'),
        position: formData.get('position'),
        name: formData.get('name'),
        email: formData.get('email'),
        submitted_at: new Date().toISOString(),
        user_agent: navigator.userAgent
    };

    // API送信
    try {
        const response = await fetch('https://kokotomo-dashboard-prod.onrender.com/api/lp/survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showModal();
            this.reset();
        } else {
            alert('送信に失敗しました。もう一度お試しください。');
        }
    } catch (error) {
        console.error('Error:', error);
        // API未実装時はモーダル表示（デモ用）
        showModal();
        this.reset();
    }
});

// ===== モーダル制御 =====
function showModal() {
    document.getElementById('successModal').classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

// モーダル外クリックで閉じる
document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
