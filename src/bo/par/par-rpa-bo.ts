"use strict";
import Photo = require("hornet-js-core/src/data/file");

class Partenaire {
    id:number;
    civilite:{id:string};
    pays:{id:string};
    ville:{id:string};
    nationalite:{id:string};
    isClient:boolean;
    isVIP:boolean;
    photo:Photo;

}
export = Partenaire;
