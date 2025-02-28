import 'package:flutter/material.dart';

class ContactManagementPage extends StatefulWidget {
  final List<String> contacts;

  // Convert the parameter 'key' to a super parameter
  const ContactManagementPage({super.key, required this.contacts});

  @override
  _ContactManagementPageState createState() => _ContactManagementPageState();
}

class _ContactManagementPageState extends State<ContactManagementPage> {
  final TextEditingController _contactController = TextEditingController();

  void _addContact() {
    setState(() {
      widget.contacts.add(_contactController.text);
    });
    _contactController.clear();
  }

  void _removeContact(int index) {
    setState(() {
      widget.contacts.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Contacts'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _contactController,
              decoration: const InputDecoration(
                labelText: 'Enter contact',
              ),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _addContact,
              child: const Text('Add Contact'),
            ),
            Expanded(
              child: ListView.builder(
                itemCount: widget.contacts.length,
                itemBuilder: (context, index) {
                  final contact = widget.contacts[index];
                  return ListTile(
                    title: Text(contact),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () => _removeContact(index),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
