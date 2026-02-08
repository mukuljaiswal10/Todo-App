export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Premium gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.14),transparent_55%)]" />
      {children}
    </div>
  );
}
