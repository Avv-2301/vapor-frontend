import { Brand } from "./Header";
import Icon from "./Icon";
export default function Footer({ onAction }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Brand footer />
          <div>
            {[
              ["broadcast", "Global Broadcasts"],
              ["group", "Network Status"],
              ["monitor", "Mobile Client"],
            ].map(([icon, label]) => (
              <button
                className="icon-button"
                key={label}
                aria-label={label}
                onClick={() => onAction(label)}
              >
                <Icon name={icon} />
              </button>
            ))}
          </div>
        </div>
        <p>
          © 2024 Vapor Corporation. All rights reserved. All trademarks are
          property of their respective owners in the US and other countries. VAT
          included in all prices where applicable.
        </p>
        <nav aria-label="Legal information">
          {[
            "Privacy Policy",
            "Legal & Steam Subscriber Agreement",
            "Refunds Policy",
            "Cookies",
            "Merchant Solutions",
          ].map((text) => (
            <button key={text} onClick={() => onAction(text)}>
              {text}
            </button>
          ))}
        </nav>
        <div className="footer-bottom">
          <span>
            <Icon name="globe" size={16} /> Language: English (US){" "}
            <Icon name="down" size={12} />
          </span>
          <span>Vapor Client Build v4.9.22 • Steamworks API Compatible</span>
        </div>
      </div>
    </footer>
  );
}
