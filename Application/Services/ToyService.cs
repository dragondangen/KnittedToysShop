using Application.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class ToyService : IToyService
{
    private readonly IToyRepository _repository;

    public ToyService(IToyRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Toy>> GetAllToysAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task AddToyAsync(Toy toy)
    {
        if (toy == null)
        {
            throw new ArgumentNullException(nameof(toy));
        }
        // Опционально: дополнительные проверки, например, на пустые поля
        if (string.IsNullOrEmpty(toy.Name))
        {
            throw new ArgumentException("Имя игрушки не может быть пустым", nameof(toy.Name));
        }
        if (toy.Price <= 0)
        {
            throw new ArgumentException("Цена должна быть положительной", nameof(toy.Price));
        }
        await _repository.AddAsync(toy);
    }

    public async Task UpdateToyAsync(Toy toy)
    {
        if (toy == null)
        {
            throw new ArgumentNullException(nameof(toy));
        }
        if (toy.Id <= 0)
        {
            throw new ArgumentException("ID должен быть положительным", nameof(toy.Id));
        }
        if (string.IsNullOrEmpty(toy.Name))
        {
            throw new ArgumentException("Имя игрушки не может быть пустым", nameof(toy.Name));
        }
        if (toy.Price <= 0)
        {
            throw new ArgumentException("Цена должна быть положительной", nameof(toy.Price));
        }
        await _repository.UpdateAsync(toy);
    }

    public async Task DeleteToyAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("ID должен быть положительным", nameof(id));
        }
        await _repository.DeleteAsync(id);
    }

    public async Task<Toy?> GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("ID должен быть положительным", nameof(id));
        }
        return await _repository.GetByIdAsync(id);
    }
}