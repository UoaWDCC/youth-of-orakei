import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';
import { getPageContentBlockIds, getBlockTitle } from 'notion-utils';
import type { ExtendedRecordMap } from 'notion-types';

interface NotionPageProps {
  recordMap: ExtendedRecordMap;
}

const NotionPage: React.FC<NotionPageProps> = ({ recordMap }) => {
  const blockIds = getPageContentBlockIds(recordMap);
//   const filteredBlockIds = blockIds.filter((id) => {
//     const block = recordMap.block[id].value;
//     return block.type !== 'image' && block.type !== 'sub_header';
//   });

//   const filteredRecordMap = {
//     ...recordMap,
//     block: Object.fromEntries(
//       filteredBlockIds.map((id) => [id, recordMap.block[id]])
//     ),
//   };

//   return <NotionRenderer recordMap={filteredRecordMap} fullPage={false} darkMode={false} />;

return <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={false} />;
};

export default NotionPage;
