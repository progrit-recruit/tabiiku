import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "たびいく！ - 家族旅行を一生モノの学びに",
  description: "AIコンシェルジュが多忙な親の旅行計画をゼロから一括サポート。子どもの好奇心を育てる「旅育」特化型プランニングアプリ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body style={{ background: "#B2AA9E", minHeight: "100vh", margin: 0, padding: 0 }}>
        <div
          style={{
            maxWidth: "430px",
            margin: "0 auto",
            background: "#F5EFE6",
            minHeight: "100vh",
            position: "relative",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
