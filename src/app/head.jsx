export default function Head() {
  const site = "https://todo-app-five-theta-86.vercel.app"; // ✅ apna live domain
  const title = "Pro Todo — Premium workspace";
  const desc = "Advanced Pro Todo app to manage tasks like a pro.";
  const ogImg = `${site}/og.png`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />

      {/* ✅ Open Graph (WhatsApp/Facebook/LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={site} />
      <meta property="og:image" content={ogImg} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* ✅ Twitter bhi same image use kare */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImg} />
    </>
  );
}
