# e-SORA

This template provides a first version of an e-SORA tool.
It aims at simplify the task of redaction of the SORA 2.5 process for the UAS specific category. 

Currently, it is under devlopment and has no guaranty.



- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Installation in local

The code is based on React working in Vite with HMR and some ESLint rules.

- First install jsnode and npm
- Then run #npm install
- You can now run #npm run dev

Enjoy the server in your favorite browser.


## Warning

For now, evrything is linked to a supabase database owned by the devlopper. 
Link to its supabase instance is provided with no maintenance garantee and the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY defined in the .env file are subject to modiifications. 
If needed ask the devlopper for a copy of the database structure to implement your own supabase instance. 


