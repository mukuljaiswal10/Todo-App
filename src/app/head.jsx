export default function Head() {
  return (
    <>
      <title>Pro Todo</title>
      <meta
        name="description"
        content="Pro Todo — Premium workspace for tasks."
      />

      {/* One image everywhere */}
      <meta property="og:title" content="Pro Todo" />
      <meta
        property="og:description"
        content="Pro Todo — Premium workspace for tasks."
      />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/og.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter will also use SAME image */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="/og.png" />
    </>
  );
}
