import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Renderer
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons
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
    private modalService: NgbModal) {}

  empList: Array < Object > = [];
  list: Array < number > = [];
  closeResult: string;
  gold: boolean = false;
  silver: boolean = false;
  bronze: boolean = false;
  win: boolean = false;

  ngOnInit() {
    var gameList = localStorage.getItem("gameList");
    if (gameList == null) {
      for (var i = 1; i <= 250; i++) {
        this.empList.push({
          "index": i,
          "active": "",
          "nextline": i % 25 == 1 ? "clear" : "",
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

  reset() {
    localStorage.removeItem("gameList");
    window.location.reload();
  }

  getPrice() {
    for (var i = 1; i <= 2; i++) {
      var n = this.getRandomNumber();
      this.empList.forEach((obj) => {
        if (n == obj["index"]) {
          obj["price"] = "gold";
        }
      });
    }

    for (var i = 1; i <= 75; i++) {
      var n = this.getRandomNumber();
      this.empList.forEach((obj) => {
        if (n == obj["index"]) {
          obj["price"] = "silver";
        }
      });
    }

    for (var i = 1; i <= 115; i++) {
      var n = this.getRandomNumber();
      this.empList.forEach((obj) => {
        if (n == obj["index"]) {
          obj["price"] = "bronze";
        }
      });
    }
  }

  getRandomNumber() {
    var num = Math.floor(Math.random() * Math.floor(250));
    if (!this.numberExist(num)) {
      this.list.push(num);
      return num;
    } else {
      this.getRandomNumber();
    }
  }

  numberExist(num: number) {
    if (this.list.length) {
      return this.list.indexOf(num) != -1;
    }
    return false;
  }

  open(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    });
  }
}
