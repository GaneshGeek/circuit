import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './config';

const PROJECTS_COLLECTION = 'projects';

export async function saveProjectToCloud(projectData) {
  if (!auth.currentUser) {
    throw new Error('User must be signed in to save to cloud');
  }

  const projectId = projectData.id || `proj_${Date.now()}`;
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);

  const payload = {
    id: projectId,
    name: projectData.name || 'Untitled Project',
    desc: projectData.desc || 'Custom circuit design',
    userId: auth.currentUser.uid,
    authorName: auth.currentUser.displayName || 'Maker',
    components: projectData.components || [],
    wires: projectData.wires || [],
    firmwareCode: projectData.firmwareCode || '',
    status: projectData.status || 'Draft',
    isPublic: projectData.isPublic ?? false,
    createdAt: projectData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PROJECTS_COLLECTION}/${projectId}`);
  }
}

export async function updateProjectStatusInCloud(projectId, status) {
  if (!auth.currentUser) return;
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  try {
    await setDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PROJECTS_COLLECTION}/${projectId}`);
  }
}

export async function fetchUserProjects() {
  if (!auth.currentUser) return [];

  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('userId', '==', auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const projects = [];
    snapshot.forEach(docSnap => {
      projects.push(docSnap.data());
    });
    return projects;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
    return [];
  }
}

export async function deleteProjectFromCloud(projectId) {
  if (!auth.currentUser) return;
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PROJECTS_COLLECTION}/${projectId}`);
  }
}
