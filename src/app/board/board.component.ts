import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Renderer
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit {
  @ViewChild('content', {
    static: false
  })
  private content: TemplateRef < any > ;

  constructor(private render: Renderer,
    private modalService: NgbModal,
    private fb: FormBuilder) {
      // this.createForm();
    }

  settingsForm: FormGroup;

  empList: Array < Object > = [];
  list: Array < number > = [];
  priceList: Array < Object > = [];
  
  closeResult: string;
  gold: boolean = false;
  silver: boolean = false;
  bronze: boolean = false;
  win: boolean = false;

  boxList: Array < number > = [5, 6, 7, 8, 9, 10];

  count: number = 100;
  size: number = 10;
  totalSize: number = this.size * this.size;

  ngOnInit() {
    this.createForm();
    this.createGame();
  }

  settings = {
    goldPrice : "Gold",
    silverPrice : "Silver",
    bronzePrice : "Bronze",
    goldCount : 5,
    silverCount : 10,
    bronzeCount : 30,
  }

  createForm() {
    this.settingsForm = this.fb.group({
      boxSizeList: [this.size, Validators.required],
      goldPrice: [this.settings.goldPrice, Validators.required],
      goldCount: [this.settings.goldCount, Validators.required],
      silverPrice: [this.settings.silverPrice, Validators.required],
      silverCount: [this.settings.silverCount, Validators.required],
      bronzePrice: [this.settings.bronzePrice, Validators.required],
      bronzeCount: [this.settings.bronzeCount, Validators.required],
    });
  }

  createGame() {
    this.empList = [];
    this.list = [];
    var gameList = localStorage.getItem("gameList");
    this.totalSize = this.size * this.size;
    if (gameList == null) {
      for (var i = 1; i <= this.totalSize; i++) {
        this.empList.push({
          "index": i,
          "active": "",
          "nextline": i % this.size == 1 ? "clear" : "",
        });
      }
      this.getPrice();
    } else {
      this.empList = JSON.parse(gameList);
    }
  }

  activate(event: any) {
    event.preventDefault();
    var id = event.target.attributes.id;
    var isActive = event.target.classList.contains("active");

    if (!isActive) {
      this.render.setElementClass(event.target, "active", !isActive);
      this.empList.forEach((obj) => {
        if (id.nodeValue == obj["index"]) {
          obj["active"] = !isActive ? "active" : "";
        }
      });

      this.gold = event.target.classList.contains("gold");
      this.silver = event.target.classList.contains("silver");
      this.bronze = event.target.classList.contains("bronze");
      if (this.gold || this.silver || this.bronze) {
        this.win = true;
      } else {
        this.win = false;
      }
      this.open(this.content);
    }

    localStorage.setItem("gameList", JSON.stringify(this.empList));
  }

  newGame() {
    localStorage.removeItem("gameList");
    window.location.reload();
  }

  generate(){
    var size = this.settingsForm.value.boxSizeList;
    var total = size * size;
    if (this.validateCount(size)) {
      this.size = size;
      localStorage.removeItem("gameList");
      this.createGame();
    } else {
      alert("Sorry, price count ("+this.count+") is bigger than the total count ("+total+")" )
    }
  }

  getPrice() {
    var goldCount = this.settingsForm.value.goldCount;
    for (var i = 1; i <= goldCount; i++) {
      var n = this.getRandomNumber();
      this.empList.forEach((obj) => {
        if (n == obj["index"]) {
          obj["price"] = "gold";
        }
      });
    }

    var silverCount = this.settingsForm.value.silverCount;
    for (var i = 1; i <= silverCount; i++) {
      var n = this.getRandomNumber();
      this.empList.forEach((obj) => {
        if (n == obj["index"]) {
          obj["price"] = "silver";
        }
      });
    }

    var bronzeCount = this.settingsForm.value.bronzeCount;
    for (var i = 1; i <= bronzeCount; i++) {
      var n = this.getRandomNumber();
      this.empList.forEach((obj) => {
        if (n == obj["index"]) {
          obj["price"] = "bronze";
        }
      });
    }
  }

  getRandomNumber() {
    var random = Math.floor(Math.random() * Math.floor(this.totalSize));
    var num = random == 0 ? this.totalSize : random;

    if (!this.numberExist(num)) {
      this.list.push(num);
      return num;
    } else {
      return this.getRandomNumber();
    }
  }

  numberExist(num: number) {
    if (this.list.length) {
      return this.list.indexOf(num) != -1;
    }
    return false;
  }

  validateCount(size : number) {
    var totalSize = size * size;
    this.count = this.settingsForm.value.goldCount + 
    this.settingsForm.value.silverCount +
    this.settingsForm.value.bronzeCount;
    return this.count <= totalSize;
  }

  open(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    });
  }
}