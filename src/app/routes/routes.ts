import {ModuleWithProviders} from '@angular/core';

import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {IndexComponent} from './index/index.component';
import {CanAuthProvide} from '@core/services/auth.service';
import {CalendarComponent} from './calendar/calendar.component';
import {ArrangedComponent} from './orders/arranged/arranged.component';
import {DisarrangedComponent} from './orders/disarranged/disarranged.component';
import {ProfileComponent} from './profile/profile.component';
import {passwordEditComponent} from './passwordEdit/passwordEdit.component';
import {OrderDetailComponent} from './orders/orderDetail/orderDetail.component';
import {HistoricalOrdersComponent} from './orders/historicalOrders/historicalOrders.component';
import {StudentSignInComponent} from './studentSignIn/studentSignIn.component';
import {HistoricalRecordsComponent} from './studentSignIn/historicalRecords/historicalRecords.component';
import {AddStudentComponent} from './studentSignIn/addStudent/addStudent.component';
import {ShowStudentSignRecordComponent} from './studentSignIn/showStudentSignRecord/showStudentSignRecord.component';
import {CoursesComponent} from './courses/courses.component';
import {HistoricalCoursesComponent} from './courses/historicalcourses/historicalCourses.component';
import {AddCourseComponent} from './courses/addCourse/addCourse.component';
import {EditCourseComponent} from './courses/editCourse/editCourse.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canLoad: [CanAuthProvide]},
    {
        path: '', component: HomeComponent, canActivate: [CanAuthProvide],
        children: [
            {
                path: 'index', component: IndexComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '首页'
                }
            },
            {
                path: 'courses', component: CoursesComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '课程管理'
                }
            },
            {
                path: 'courses/history', component: HistoricalCoursesComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '历史课程'
                }
            },
            {
                path: 'courses/add', component: AddCourseComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '添加课程'
                }
            },
            {
                path: 'courses/edit', component: EditCourseComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '编辑课程'
                }
            },
            {
                path: 'calendar', component: CalendarComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '本周上机课程'
                }
            },
            {
                path: 'arranged', component: ArrangedComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '已安排预约'
                }
            },
            {
                path: 'arranged/history', component: HistoricalOrdersComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '历史预约'
                }
            },
            {
                path: 'disarranged', component: DisarrangedComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '未安排预约'
                }
            }, {
                path: 'arranged/edit', component: OrderDetailComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '预约修改'
                }
            },  {
                path: 'profile', component: ProfileComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '个人资料'
                }
            },  {
                path: 'passwordEdit', component: passwordEditComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '密码修改'
                }
            }, {
                path: 'studentSignIn', component: StudentSignInComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '我的签到'
                }
            },
            {
                path: 'studentSignIn/history', component: HistoricalRecordsComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '历史签到记录'
                }
            },
            {
                path: 'studentSignIn/add', component: AddStudentComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '签到'
                }
            },
            {
                path: 'studentSignIn/show', component: ShowStudentSignRecordComponent, canActivate: [CanAuthProvide],
                data: {
                    breadcrumb: '查看签到记录'
                }
            },
            {path: '', redirectTo: 'index', pathMatch: 'full'}
        ]
    },
    {path: '**', redirectTo: 'index', pathMatch: 'full'}
];

