import {Component, OnInit} from '@angular/core';
import {HistoricalRecordsService} from './historicalRecords.service';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.module';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-HistoricalCourses',
  templateUrl: 'historicalRecords.component.html',
  styleUrls: ['./historicalRecords.component.less'],
  providers: [HistoricalRecordsService]
})

export class HistoricalRecordsComponent implements OnInit {
    constructor(private historicalRecordsService: HistoricalRecordsService, private confirmServ: NzModalService, private  router: Router,
                private _storage: SessionStorageService, private fb: FormBuilder) {
    }
    validateForm: FormGroup;
    apiUrl = [
        'http://www.mrzhao14.cn/LabManager/studentSignIn/getPastedSignTaskBySemester', /*0获取签到信息*/
        'http://www.mrzhao14.cn/LabManager/studentSignIn/getSignCountToStudentBySemester', /*1获取签到人数信息*/
        'http://www.mrzhao14.cn/LabManager/semester/getNowSemester', // 2
        'http://www.mrzhao14.cn/LabManager/user/getUserByUserName'
    ];

    WEEK = ['日', '一', '二', '三', '四', '五', '六', '日'];
    doCount;
    undoCount;
    signRecords = [];
    data = [];
    // 获取学期
    searchSemester = this._storage.get('historyCourses');
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    private getSemester() {
        this.historicalRecordsService.executeGET(this.apiUrl[2])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.nowSemester = res['NowSemester'];
                }
            });
    }
    private getHours(course: any) {
        return course.classNum.length * course.classWeek.length;
    }
    private _getData = () => {
        // 获取当前学期信息
        this.getSemester();
        this.historicalRecordsService.executeHttp(this.apiUrl[0], {studentId:this._storage.get('username'),semester:this.searchSemester})
            .then((result: any) => {
                const data = JSON.parse(result['_body'])['pastedSignTaskList'];
                for (let i of data) {
                    i.expand = false;
                    // 获取教师信息
                    this.historicalRecordsService.executeHttp(this.apiUrl[3], {userName: i.userName})
                        .then((res: any) => {
                            let temp = JSON.parse(res['_body'])['User1'];
                            i.userNickname = temp.userNickname;
                            i.email = temp.email;
                            i.phone = temp.phone;
                        });
                }
                this.signRecords = data;
            });
        this.historicalRecordsService.executeHttp(this.apiUrl[1], {studentId:this._storage.get('username'),semester:this.searchSemester})
            .then((result: any) => {
                this.undoCount = JSON.parse(result['_body'])['undoCount'];
                this.doCount = JSON.parse(result['_body'])['doCount'];
            });
    }
    onSearch(event: string): void {
        console.log(event);
    }
    ngOnInit(): void {

        this._getData();
    }
}
