import {Component, OnInit} from '@angular/core';
import {HistoricalCoursesService} from './historicalCourses.service';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.module';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-HistoricalCourses',
  templateUrl: 'historicalCourses.component.html',
  styleUrls: ['./historicalCourses.component.less'],
  providers: [HistoricalCoursesService]
})

export class HistoricalCoursesComponent implements OnInit {
    constructor(private historicalCoursesService: HistoricalCoursesService, private confirmServ: NzModalService, private  router: Router,
                private _storage: SessionStorageService, private fb: FormBuilder) {
    }
    validateForm: FormGroup;
    apiUrl = [
        'http://www.mrzhao14.cn/LabManager/class/getClassByStudentIdAndSemester', /*0获取课程*/
        'http://www.mrzhao14.cn/LabManager/semester/getNowSemester', // 1
        'http://www.mrzhao14.cn/LabManager/user/getUserByUserName'
    ];

    WEEK = ['日', '一', '二', '三', '四', '五', '六', '日'];
    _value = ''; /*搜索内容*/
    choice = 'all';
    courses = [];
    data = [];
    // 获取学期
    searchSemester = this._storage.get('historyCourses');
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    private getSemester() {
        this.historicalCoursesService.executeGET(this.apiUrl[1])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.nowSemester = res['NowSemester'];
                }
            });
    }
    private getAllHours(courses: any) {
        let hours = 0;
        for (let course of courses) {
            hours += course.classNum.length * course.classWeek.length;
        }
        return hours;
    }
    private getWeekHours(courses: any) {
        let hours = 0;
        for (let course of courses) {
            hours += course.classNum.length;
        }
        return hours;
    }
    private getHours(course: any) {
        return course.classNum.length * course.classWeek.length;
    }
    private _getData = () => {
        // 获取当前学期信息
        this.getSemester();
        // 获取课程
        let data = {
            studentId: this._storage.get('username'),
            semester: this.searchSemester
        }
        this.historicalCoursesService.executeHttp(this.apiUrl[0], data)
            .then((result: any) => {
                const data = JSON.parse(result['_body'])['course'];
                for (let i of data) {
                    i.expand = false;
                    // 获取教师信息
                    this.historicalCoursesService.executeHttp(this.apiUrl[2], {userName: i.userName})
                        .then((res: any) => {
                            let temp = JSON.parse(res['_body'])['User1'];
                            i.userNickname = temp.userNickname;
                            i.email = temp.email;
                            i.phone = temp.phone;
                        });
                }
                this.courses = data;
            });
    }
    onSearch(event: string): void {
        console.log(event);
    }
    ngOnInit(): void {

        this._getData();
    }
}
