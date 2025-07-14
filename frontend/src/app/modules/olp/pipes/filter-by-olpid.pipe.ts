import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByOLPID',
  standalone:false
})
export class FilterByOLPIDPipe implements PipeTransform {
  transform(clients: any[], search: string): any[] {
    if (!search) return clients;
    return clients.filter(client =>
      client.OLPID?.toLowerCase().includes(search.toLowerCase())
    );
  }
}
