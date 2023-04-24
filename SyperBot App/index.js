require("dotenv").config();

const { App } = require("@slack/bolt");
const { FileInstallationStore } = require("@slack/oauth");
const { default: axios } = require("axios");
const signingSecret = process.env["SLACK_SIGNING_SECRET"];
const clientId = process.env["CLIENT_ID"];
const clientSecret = process.env["SLACK_CLIENT_SECRET"];
const stateSecret = process.env["STATE_SECRET"];
const token = process.env["SLACK_BOT_TOKEN"];
const apiUrl = process.env["API_URL"];
const app = new App({
  signingSecret,
  token,
  clientId,
  clientSecret,
  stateSecret,
  scopes: ["chat:write", "commands", "im:history"],
  installationStore: new FileInstallationStore(),
});

app.command("/notes", async ({ command, ack, respond }) => {
  await ack();
  let notes = "";
  let resp = await axios.get(`${apiUrl}/notes`);
  if (resp.data.length === 0) {
    notes =
      "Oops, there are no notes to display at the moment. You can add a note by typing `/save<space>title<space>message` in the input field below. To separate the title with spaces, you can use an underscore (_) example `my_title<space>my message and url or emoji, etc`. Let's get started!";
    await respond(notes);
  } else if (resp.data.length !== 0) {
    resp.data.map((el, id) => {
      notes += `${id + 1} : : #${el.title}\n`;
    });
    notes += `\n\n use the title with # to get the Note`;
    await respond(`Hello, <@${command.user_name}>,\nTake a look at these notes \n ${notes}`);
  } else {
    await respond(`Oops! It seems like we hit a snag. Please try again.`);
  }
});

app.command("/save", async ({ command, ack, respond }) => {
  await ack();
  let [title, ...message] = command.text.split(" ");
  let noteObj = {
    title,
    message: message.join(" "),
    date: new Date().toLocaleString(),
  };
  try {
    await axios.post(`${apiUrl}/notes`, noteObj);
    respond("Note Saved, View by command /notes");
  } catch (error) {
    console.log("error: ", error);
    await respond(`Oops! It seems like we hit a snag. Please try again.`);
  }
});

app.command("/update", async ({ command, ack, respond }) => {
  await ack();
  let [title, ...message] = command.text.split(" ");
  let noteObj = {
    title,
    message: message.join(" "),
    date: new Date().toLocaleString(),
  };
  try {
    await axios.patch(`${apiUrl}/notes/${title}`, noteObj);
    respond("Note Saved, View by command /notes");
  } catch (error) {
    console.log("error: ", error);
    await respond(`Oops! It seems like we hit a snag. Please try again.`);
  }
});

app.command("/delete", async ({ command, ack, respond }) => {
  await ack();
  let title = command.text;
  try {
    await axios.delete(`${apiUrl}/notes/${title}`);
    respond("Note Deleted, View by command /notes");
  } catch (error) {
    console.log("error: ", error);
    await respond(`Oops! It seems like we hit a snag. Please try again.`);
  }
});

app.message(/^#\S*$/, async ({ message, context, say }) => {
  let str = context.matches[0].replace("#", "");
  const res = await axios.get(`${apiUrl}/notes/data?search=${str}`);
  let reply = "";
  if (res.data.length === 0) {
    reply = "No Notes Found!";
  } else if (res.data.length !== 0) {
    reply += "Title : " + res.data[0].title + "\n";
    reply += "---------------------\n";
    reply += "Message : " + res.data[0].message + "\n";
    reply += "---------------------\n";
    reply += "Date : " + res.data[0].date + "\n";
  } else {
    reply = "Oops! It seems like we hit a snag. Please try again.";
  }
  await say(`<@${message.user}> \n ${reply}`);
});

app.message(/^(hi|hello|hey).*/, async ({ context, say }) => {
  const greeting = context.matches[0];
  await say(`${greeting}, how are you?`);
});

(async () => {
  await app.start(process.env.PORT || 7744);

  console.log(`Syper app is running!`);
})();
