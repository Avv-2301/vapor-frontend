import Icon from "../common/Icon";
import { useAppStore } from "../../stores/appStore";
export default function Newsletter() {
  const newsletterEmail = useAppStore((state) => state.newsletterEmail);
  const subscribeNewsletter = useAppStore((state) => state.subscribeNewsletter);
  const subscribed = Boolean(newsletterEmail.trim());
  function subscribe(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    subscribeNewsletter(data.get("email"));
  }
  return (
    <section className="newsletter section">
      <div className="newsletter-inner">
        <span className="newsletter-eyebrow">
          <Icon name="bell" size={14} /> Sale Intel & Event Radar
        </span>
        <h2>Never Miss a Vapor Sale or Major Release</h2>
        <p>
          Receive curated weekend discounts, Steam event countdowns, free
          weekend notifications, and publisher beta keys tailored directly to
          your favorite tags.
        </p>
        {subscribed ? (
          <div className="subscription-success" role="status">
            <Icon name="check" />
            <div>
              <strong>You’re subscribed to Vapor updates.</strong>
              <p>Thanks for joining!</p>
            </div>
            <button onClick={() => subscribeNewsletter("")}>
              Edit email
            </button>
          </div>
        ) : (
          <form onSubmit={subscribe}>
            <div className="newsletter-input">
              <label>
                <Icon name="mail" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your gaming email..."
                  aria-label="Your gaming email"
                />
              </label>
              <button type="submit">
                Subscribe to Vapor Alerts <Icon name="send" size={16} />
              </button>
            </div>
            <small>
              No spam. One-click unsubscribe anytime. Read our Privacy
              Agreement.
            </small>
          </form>
        )}
      </div>
    </section>
  );
}
