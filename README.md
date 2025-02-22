# ScheduleBell 📅🔔

**The smart, flexible, and easy-to-use bell scheduling system!**

## 🚀 About the Project

ScheduleBell is a web-based alarm system that plays scheduled MP3 chimes to mark lesson times, breaks, and other school or workplace events. Built with **Next.js**, it provides a **modern UI**, **schedule updates**, and an **admin panel for easy customization**.

It is designed to be a **general-purpose** bell scheduling tool that can be used in **schools, offices, and other institutions** that require a structured time-management system.

Currently this project is mainly used in institutions in Israel therefore **the UI is in Hebrew** - Having multi language support is one of the future goals.

## ✨ Features

- 📆 **Interactive Schedule Display** – View the full daily schedule in an intuitive UI.
- 🔔 **Automated Bell System** – Clients fetch the schedule and play the alarm sound at the correct times.
- ⏭️ **Upcoming Lesson Indicator** – Always see what's coming next.
- 🎵 **Custom MP3 Bell Sounds** – Upload your own audio files for the alarm.
- ⚙️ **Admin Panel** – Securely update the schedule and audio files.
- 🛠️ **Test Alarm Button** – Instantly test the bell sound to ensure it's working.

## 🖥️ Tech Stack

- **Frontend:** Next.js (React)
- **Storage:** Vercel Storage (for MP3 files and JSON schedules)

## 📸 Screenshots

🚀 _Coming Soon!_ 🚀

## 📦 Installation & Deployment

Currently supporting only **Vercel Storage**, create a project on Vercel and obtain a `BLOB_READ_WRITE_TOKEN`.

- Add the token to a `.env.local` file on the root of the project:

  ```bash
  BLOB_READ_WRITE_TOKEN="your_token_here"
  ```

  in addition to be able to login into the admin panel set a admin password:

  ```bash
  ADMIN_PASSWORD="enter-password-here"
  ```

### Auto

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheCommandCat/ScheduleBell)

### Manual

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TheCommandCat/ScheduleBell.git
   cd schedulebell
   ```
2. **Install dependencies:**
   ```bash
   npm i
   ```
3. **Run locally:**
   ```bash
   npm run dev
   ```
4. **Deploy:**
   - Currently you can deploy this on **Vercel** by pushing to GitHub and linking your repository to [Vercel](https://vercel.com).

## 🎯 Future Improvements

- 🔄 **Alternative Storage Options** – Exploring ways to store config files without relying on Vercel.
- 📦 **Self-Hosting with Docker** – Developing a simple Docker package for easy self-hosting.
- 🌍 **Multi language Support** - Have the option to switch between languages.

## 📜 License

MIT License – Free to use and modify!

## 🤝 Contributing

Want to contribute? Fork the repo and submit a pull request! 🚀

## 📬 Contact

Created by **TheCommandCat** – Feel free to connect via [GitHub](https://github.com/thecommandcat)!
