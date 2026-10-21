import Icon from "../common/Icon";

const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "Japan", "Germany"];

function Field({ label, name, type = "text", required = true, autoComplete, children, ...props }) {
  return (
    <label className="checkout-field" htmlFor={`billing-${name}`}>
      <span>{label}{required && <i aria-hidden="true"> *</i>}</span>
      {children || <input id={`billing-${name}`} name={name} type={type} required={required} autoComplete={autoComplete} {...props} />}
    </label>
  );
}

export default function BillingInformation({ user, initialValue }) {
  const [firstName = "", ...lastName] = (user?.name || "").trim().split(/\s+/);
  const address = initialValue || {};
  return (
    <section className="checkout-panel billing-panel" aria-labelledby="billing-title">
      <div className="checkout-panel-heading">
        <h2 id="billing-title"><Icon name="badge" size={21} /> Billing Information &amp; Contact</h2>
        <span>Required for your digital receipt</span>
      </div>
      <div className="checkout-form-grid">
        <Field label="First name" name="firstName" autoComplete="given-name" defaultValue={address.firstName || firstName} />
        <Field label="Last name" name="lastName" autoComplete="family-name" defaultValue={address.lastName || lastName.join(" ")} />
        <Field label="Email address (receipt & keys)" name="email" type="email" autoComplete="email" defaultValue={address.email || user?.email || ""} />
        <div className="checkout-field">
          <span id="phone-label">Phone number</span>
          <div className="checkout-phone-field">
            <select name="callingCode" aria-label="Country calling code" defaultValue={address.callingCode || "+91"} autoComplete="tel-country-code">
              <option value="+91">+91 (IN)</option>
              <option value="+1">+1 (US)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+81">+81 (JP)</option>
              <option value="+49">+49 (DE)</option>
            </select>
            <input aria-labelledby="phone-label" name="phone" type="tel" defaultValue={address.phone || ""} autoComplete="tel-national" placeholder="Phone number" />
          </div>
        </div>
        <Field label="Street address" name="street" autoComplete="address-line1" defaultValue={address.street || ""} />
        <Field label="Apartment, suite, unit (optional)" name="unit" required={false} autoComplete="address-line2" placeholder="Apartment or suite" defaultValue={address.unit || ""} />
        <Field label="City" name="city" autoComplete="address-level2" defaultValue={address.city || ""} />
        <Field label="State / province" name="region" autoComplete="address-level1" defaultValue={address.region || ""} />
        <Field label="Postal code" name="postalCode" autoComplete="postal-code" defaultValue={address.postalCode || ""} />
        <Field label="Country / region" name="country">
          <select id="billing-country" name="country" autoComplete="country-name" defaultValue={address.country || "India"} required>
            {countries.map((country) => <option key={country} value={country}>{country}</option>)}
          </select>
        </Field>
      </div>
      <label className="checkout-save-address"><input type="checkbox" name="saveAddress" defaultChecked={Boolean(initialValue)} /> <span>Save this billing address for faster purchases on Vapor</span></label>
    </section>
  );
}
