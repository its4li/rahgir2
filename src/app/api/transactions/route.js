// ... existing code ...
export async function GET(req) {
  // ... existing code ...
  const { searchParams } = new URL(req.url);
  const network = searchParams.get('network');
  const address = searchParams.get('address');
  const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100);

  if (!network || !address) {
    return NextResponse.json({ error: 'پارامترهای network و address الزامی هستند.' }, { status: 400 });
  }

  try {
    // شبکه‌های EVM (بدون تغییر)
    if (['eth', 'bnb', 'arb', 'op'].includes(network)) {
      // ... existing code ...
      // return NextResponse.json({ ... پاسخ EVM ... });
    }

    // اضافه شد: بیت‌کوین با Esplora (بدون نیاز به API Key)
    if (network === 'btc') {
      const url = `https://blockstream.info/api/address/${address}/txs`;
      const res = await fetch(url, { headers: { accept: 'application/json' } });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: `BTC API Error: ${res.status} ${text}` }, { status: res.status });
      }
      const data = await res.json();
      const items = Array.isArray(data) ? data.slice(0, limit) : [];
      return NextResponse.json({
        network,
        address,
        items, // آرایه‌ای از تراکنش‌های Esplora
      });
    }

    // اضافه شد: سولانا با Solscan Pro API (نیاز به API Key در هدر token)
    if (network === 'sol') {
      const apiKey = process.env.SOLANA_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: 'SOLANA_API_KEY در متغیرهای محیطی تنظیم نشده است.' }, { status: 500 });
      }
      const url = `https://pro-api.solscan.io/v2.0/account/transactions?account=${encodeURIComponent(
        address
      )}&limit=${limit}`;

      const res = await fetch(url, {
        headers: {
          accept: 'application/json',
          // هدر طبق مستندات رسمی Solscan Pro API
          token: apiKey,
        },
        // اگر لازم بود: next: { revalidate: 15 }
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        return NextResponse.json(
          { error: `SOL API Error: ${res.status} ${json?.message || ''}` },
          { status: res.status || 500 }
        );
      }

      // برخی پاسخ‌ها data یا items دارند؛ به صورت محافظه‌کارانه هندل می‌کنیم
      const items = Array.isArray(json?.data?.items)
        ? json.data.items
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

      return NextResponse.json({
        network,
        address,
        items,
      });
    }

    return NextResponse.json({ error: 'شبکه پشتیبانی نمی‌شود.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: `Server Error: ${err.message}` }, { status: 500 });
  }
}
// ... existing code ...
