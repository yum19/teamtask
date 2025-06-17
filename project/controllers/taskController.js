const Task = require('../models/Task');
const User = require('../models/User');

const getTasks = async (req, res) => {
  try {
    if (req.user.role === 'manager') {
      const tasks = await Task.find()
        .populate('assignedTo', 'name email _id')
        .populate('createdBy', 'name email _id');
      const users = await User.find({}, 'name email _id role');
      return res.status(200).json({ tasks, users });
    } else {
      const tasks = await Task.find({ assignedTo: req.user.userId })
        .populate('assignedTo', 'name email _id')
        .populate('createdBy', 'name email _id');
      res.status(200).json(tasks);
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches ❌' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    console.log('Received task data:', { title, description, status, assignedTo });

    if (!title || !assignedTo) {
      return res.status(400).json({ message: 'Title and assignedTo are required ❌' });
    }

    const user = await User.findById(assignedTo);
    if (!user) {
      console.log('User not found for ID:', assignedTo);
      return res.status(404).json({ message: 'Utilisateur non trouvé ❌' });
    }

    if (req.user.role === 'manager') {
      const manager = await User.findById(req.user.userId);
      if (manager.role === 'manager' && (assignedTo === req.user.userId || (await User.findById(assignedTo)).role === 'manager')) {
        return res.status(403).json({ message: 'Managers cannot assign tasks to themselves or other managers ❌' });
      }
    } else if (req.user.role === 'user' && assignedTo !== req.user.userId) {
      return res.status(403).json({ message: 'Users can only assign tasks to themselves ❌' });
    }

    const newTask = new Task({ title, description, status, assignedTo, createdBy: req.user.userId });
    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id)
      .populate('assignedTo', 'name email _id')
      .populate('createdBy', 'name email _id');
    console.log('Task saved successfully:', populatedTask);
    res.status(201).json({ message: 'Tâche créée avec succès ✅', task: populatedTask });
  } catch (err) {
    console.error('Task creation error:', err.message, err.stack);
    res.status(500).json({ message: 'Erreur lors de la création ❌', error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Tâche introuvable ❌' });
    if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorisé à modifier cette tâche ❌' });
    }
    const updated = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    res.status(200).json({ message: 'Tâche mise à jour ✅', task: updated });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour ❌' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Tâche introuvable ❌' });
    if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette tâche ❌' });
    }
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Tâche supprimée ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression ❌' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };