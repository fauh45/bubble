import React from "react";

import firebase from "firebase/app";
import "firebase/auth";

export const UserContext = React.createContext<firebase.User | null>(null);
