import { SvgIcon } from '@mui/material';
import {HomeIcon, EnvelopeIcon, MapIcon, FolderPlusIcon} from '@heroicons/react/24/outline'
import { Checkroom, School } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

export const navItems = [
    {
      title: 'Inicio',
      icon: (
        <SvgIcon fontSize="small" sx={{mr:1}}>
          {/* <ChartBarIcon/> */}
          <HomeIcon/>
        </SvgIcon>
      ),
      id:'Inicio',
      dropdown: [],
      role: []
    },
    {
      title: 'Licitaciones',
      icon: (
        <SvgIcon fontSize='small' sx={{mr:1}}>
          <FolderPlusIcon/>
        </SvgIcon>
      ),
      id: 'Licitaciones',
      dropdown: [],
      role: []
    },
    {
      title: 'Búsqueda',
      icon: (
        <SvgIcon fontSize="small" sx={{mr:1}}>
          {/* <ListBulletIcon /> */}
          <GroupsIcon />
          </SvgIcon>
      ),
      id: 'Búsqueda',
      dropdown: [],
      role: ['admin', 'user']
    },
  ];