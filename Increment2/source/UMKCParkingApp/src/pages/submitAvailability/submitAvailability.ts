import { Component } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


/**
 * Interface for a single lot entry
 */
export interface Lot {
    id:         number,
    name:       string,
    maxNumber:  number,
    group:      number,
    type:       string
}

/**
 * Interface for a list of Lot entries 
 */
export interface LotList {
    lots: Lot[];
}

/**
 * Interface for availability
 */
 export interface Availability{
    id:             number,
    parkingLotId:   number,
    userId:         string,
    timeReported:   number,
    availability:   number,
 }
 
 /**
 * Interface for a list of Availability entries 
 */
export interface AvailabilityList {
    availability: Availability[];
}
 
 


@Component({
  selector: 'page-submitAvailability',
  templateUrl: 'submitAvailability.html'
})
export class SubmitAvailabilityPage {

    lotList: LotList;
    aList: AvailabilityList;

  constructor(public navCtrl: NavController, public http: HttpClient, private alertCtrl: AlertController) {
    this.loadLots('assets/data/lots.json');
    this.loadAvailability('assets/data/availability.json');
  }
  
  ngAfterViewInit() {
    let tabs = document.querySelectorAll('.show-tabbar');
    if (tabs !== null) {
            Object.keys(tabs).map((key) => {
                tabs[key].style.display = 'none';
            });
        }
    }
    
    ionViewWillLeave() {
        let tabs = document.querySelectorAll('.show-tabbar');
        if (tabs !== null) {
            Object.keys(tabs).map((key) => {
                tabs[key].style.display = 'flex';
            });

        }
    }
    
    
    loadLots(filePath: string) {
        return this.http.get<LotList>(filePath).subscribe(
            data => { 
                this.lotList = data; 
                console.log(data); // works
            }
        );
    };
    
    loadAvailability(filePath: string){
        return this.http.get<AvailabilityList>(filePath).subscribe(
            data => { 
                this.aList = data; 
                console.log(data); // works
            }
        );
    };
    
    /**
     * Should take a lot name and return the availability for that lot
     * Not totally certain, how to specify which lot name is clicked
     */
    displayAvailability(lotName: string){
        console.log(lotName)
        let alert = this.alertCtrl.create({
            title: 'Test',
            subTitle: '10% Spaces Available',
            buttons: ['Dismiss']
        });
        alert.present();
    
    }
    
    setUp(){
        var testData = {
            field1: "a",
            field2: "b"
        }
        //var req = 
        this.http.post('http://127.0.0.1:8081/setup',testData).subscribe(
            data => {
                console.log(data['_body']);
            }, error => {
                console.log(error);
            });
        
        //then(data => {
        //    console.log(data.data);
        //}).catch(error => {
        //    console.log(error.status);
        //});
        //req.success(function(data) {
        //    console.log(data);
        //    alert("Successful!")
        //});
        //req.error(function(data) {
        //    alert( "failure message: " + JSON.stringify({data: data}));
        //});
    };

}
