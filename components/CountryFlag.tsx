export default function CountryFlag({ code, size = 20 }: { code: string, size?: number }) {
    const c = (code || 'eg').toLowerCase();
    return <img src={`https://flagcdn.com/w20/${c}.png`} srcSet={`https://flagcdn.com/w40/${c}.png 2x`} width={size} height={size * 0.75} alt={c} style={{ borderRadius: '2px', border: '1px solid #eee', objectFit: 'cover', display: 'inline-block' }} loading="lazy" />
}