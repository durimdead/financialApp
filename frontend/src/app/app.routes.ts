import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { FinancesComponent } from './finances/finances.component';
import { MaterialTestComponent } from './material-test/material-test.component';
import { AutocompleteMaterialUiComponent } from './material-test/autocomplete-material-ui/autocomplete-material-ui.component';

export const AppRoutes: Routes = [
    // default route
    {
        path: '', // <your-domain>/
        component: FinancesComponent
    },
    {
        path: 'about', // <your-domain>/about
        component: AboutComponent
    },
    {
        path: 'test', // <your-domain>/about
        // component: MaterialTestComponent
		component: AutocompleteMaterialUiComponent
    }
    // // "tasks" route to show the tasks of a selected user
    // {
    //     path: 'users/:userId', // <your-domain>/users/<userId>
    //     component: UserTasksComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: 'tasks',
    //             pathMatch: 'prefix'
    //         },
    //         {
    //             path: 'tasks', // <your-domain>/users/<uid>/tasks
    //             component: TasksComponent
    //         },
    //         {
    //             path: 'tasks/new', // <your-domain>/users/<uid>/tasks/new
    //             component: NewTaskComponent
    //         }
    //     ]
    // },
    // // "catch all" route (in the case that the route the user is attempting to navigate to doesn't exist)
    // {
    //     path: '**',
    //     component: NotFoundComponent
    // },
];
