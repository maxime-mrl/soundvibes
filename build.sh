#!/bin/bash
# Check presence of node_modules and .env then build both backend and frontend to ./build output

# color for displaying
Yellow='\033[1;33m'
Green='\033[0;32m'
Red='\033[0;31m'
NC='\033[0m' # reset color

# checking installation
if [[ ! -e "./frontend/node_modules" || ! -d "./backend/node_modules" ]]; then # frontend
    read -p "Missings node_modules, install now? (Y/n) " choice
    case $choice in
        [nN] )
            echo exiting...;
            exit;;
    esac
    cd frontend
    npm install
    cd ../backend
    npm install
    cd ../
fi

if [ ! -e "./backend/.env" ]; then
    echo -e "${Red}Missing .env file in ./backend, please configure.${NC}"
    exit;
fi

# Building process
echo -e "${Yellow}Building client...${NC}"
npm --prefix "./frontend" run build
echo -e "${Yellow}Building server...${NC}"
npm --prefix "./backend" run build
echo -e "${Green}Build done, if no error you can execute node ./build/server to launch the app!${NC}"