// Waitlist form -> Supabase (project "clipper", table public.waitlist).
// The publishable key below is meant to be public: the table has row-level security, and this key may
// only INSERT an email (it can't read, update or delete the list). Duplicate emails come back as 409,
// which we treat as success so we don't reveal who has already signed up.
(function () {
  var ENDPOINT = "https://rmgpdtpflribuorievan.supabase.co/rest/v1/waitlist";
  var PUBLISHABLE_KEY = "sb_publishable_QhmA5dy1g7p-pYjMkJ-nZQ_-fxHy1m-";

  var form = document.getElementById("waitlist-form");
  var thanks = document.getElementById("waitlist-thanks");
  if (!form || !thanks) return;

  var input = form.querySelector('input[type="email"]');
  var button = form.querySelector('button[type="submit"]');
  var error = document.getElementById("email-error");

  function fail(msg) {
    input.setAttribute("aria-invalid", "true");
    error.textContent = msg;
    button.disabled = false;
    button.textContent = "Join the waitlist";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = input.value.trim();
    if (!email || !input.checkValidity() || email.length > 254) {
      fail("Please enter a valid email address.");
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    error.textContent = "";
    button.disabled = true;
    button.textContent = "Joining…";

    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        apikey: PUBLISHABLE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email: email, source: "landing" }),
    })
      .then(function (res) {
        if (res.ok || res.status === 409) {
          form.hidden = true;
          thanks.hidden = false;
          thanks.setAttribute("tabindex", "-1");
          thanks.focus();
        } else if (res.status === 400) {
          fail("That email address doesn't look right.");
        } else {
          fail("Something went wrong. Please try again in a minute.");
        }
      })
      .catch(function () {
        fail("Couldn't reach the server. Check your connection and try again.");
      });
  });
})();
